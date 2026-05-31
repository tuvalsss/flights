import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { updateOrderByReference } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, skipped: true });
  }

  const sig = req.headers.get("stripe-signature");
  const payload = await req.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig || "",
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { reference?: string } };
    const reference = session.metadata?.reference;
    if (reference) {
      await updateOrderByReference(reference, { status: "paid" });
    }
  }

  return NextResponse.json({ received: true });
}
