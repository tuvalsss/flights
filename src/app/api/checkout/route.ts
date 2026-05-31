import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addOrder, getPackageById, getSettings } from "@/lib/store";
import { getStripe, isStripeConfigured, getCurrency } from "@/lib/stripe";
import { localized, isLocale, defaultLocale } from "@/i18n/config";
import type { Order } from "@/lib/types";

export const runtime = "nodejs";

function makeReference(): string {
  return "FB-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

function siteUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const packageId = String(body.packageId || "");
  const guests = Math.min(Math.max(Number(body.guests) || 1, 1), 20);
  const locale = isLocale(String(body.locale)) ? String(body.locale) : defaultLocale;
  const customerName = String(body.customerName || "").trim();
  const customerEmail = String(body.customerEmail || "").trim();
  const customerPhone = String(body.customerPhone || "").trim();
  const customerCountry = String(body.customerCountry || "").trim();

  if (!customerName || !customerEmail || !customerPhone) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const pkg = await getPackageById(packageId);
  if (!pkg) {
    return NextResponse.json({ error: "package not found" }, { status: 404 });
  }
  const settings = await getSettings();

  const unitPrice = pkg.priceFrom;
  const total = unitPrice * guests;
  const reference = makeReference();
  const id = crypto.randomUUID();
  const packageName = localized(pkg.name, locale as never);

  const baseOrder: Order = {
    id,
    reference,
    packageId: pkg.id,
    packageName,
    guests,
    unitPrice,
    total,
    currency: settings.currency,
    customerName,
    customerEmail,
    customerPhone,
    customerCountry,
    status: "pending",
    locale,
    createdAt: new Date().toISOString(),
  };

  // ── Demo mode: no Stripe keys configured ──
  if (!isStripeConfigured()) {
    await addOrder({ ...baseOrder, status: "demo" });
    return NextResponse.json({ reference, demo: true });
  }

  // ── Live mode: create a Stripe Checkout Session ──
  try {
    await addOrder(baseOrder);
    const stripe = getStripe();
    const currency = getCurrency();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          quantity: guests,
          price_data: {
            currency,
            unit_amount: Math.round(unitPrice * 100),
            product_data: {
              name: packageName,
              description: `${pkg.city} · ${pkg.nights} nights`,
            },
          },
        },
      ],
      metadata: { orderId: id, reference },
      success_url: `${siteUrl(req)}/${locale}/success?ref=${reference}`,
      cancel_url: `${siteUrl(req)}/${locale}/checkout/${pkg.id}`,
    });
    return NextResponse.json({ url: session.url, reference });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return NextResponse.json({ error: "payment init failed" }, { status: 500 });
  }
}
