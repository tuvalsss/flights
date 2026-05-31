"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale, Dictionary } from "@/i18n/config";
import { formatPrice } from "@/lib/format";

export default function CheckoutForm({
  locale,
  t,
  packageId,
  packageName,
  unitPrice,
  currency,
  demo,
}: {
  locale: Locale;
  t: Dictionary;
  packageId: string;
  packageName: string;
  unitPrice: number;
  currency: string;
  demo: boolean;
}) {
  const router = useRouter();
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    agree: false,
  });

  const total = unitPrice * guests;

  function update(key: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.phone || !form.agree) {
      setError(t.checkout.errorRequired);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          guests,
          locale,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          customerCountry: form.country,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.reference) {
        router.push(`/${locale}/success?ref=${encodeURIComponent(data.reference)}`);
      } else {
        throw new Error("no redirect");
      }
    } catch {
      setError(t.checkout.errorGeneric);
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">{t.checkout.guestDetails}</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="name">
              {t.checkout.fullName} *
            </label>
            <input
              id="name"
              className="input"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              {t.checkout.email} *
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              {t.checkout.phone} *
            </label>
            <input
              id="phone"
              className="input"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="country">
              {t.checkout.country}
            </label>
            <input
              id="country"
              className="input"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="guests">
              {t.checkout.guests}
            </label>
            <select
              id="guests"
              className="input"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="mt-6 flex items-start gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 accent-pitch-500"
            checked={form.agree}
            onChange={(e) => update("agree", e.target.checked)}
          />
          {t.checkout.agree}
        </label>

        {demo && (
          <div className="mt-5 rounded-xl border border-gold-400/30 bg-gold-400/10 p-4 text-sm">
            <div className="font-semibold text-gold-300">{t.checkout.demoTitle}</div>
            <p className="mt-1 text-slate-300">{t.checkout.demoBody}</p>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-gold mt-6 w-full py-3 text-base">
          {loading ? t.checkout.processing : `${t.checkout.payNow} · ${formatPrice(total, currency, locale)}`}
        </button>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500">
          <span aria-hidden>🔒</span>
          {t.common.secure}
        </div>
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold">{t.checkout.orderSummary}</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label={t.checkout.package} value={packageName} />
            <Row
              label={t.checkout.pricePerGuest}
              value={formatPrice(unitPrice, currency, locale)}
            />
            <Row label={t.checkout.guests} value={String(guests)} />
            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <dt className="font-semibold text-white">{t.checkout.total}</dt>
                <dd className="font-display text-2xl font-black gradient-text">
                  {formatPrice(total, currency, locale)}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-end font-medium text-slate-100">{value}</dd>
    </div>
  );
}
