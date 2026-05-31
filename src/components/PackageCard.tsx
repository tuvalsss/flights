import Link from "next/link";
import type { Locale, Dictionary } from "@/i18n/config";
import { localized } from "@/i18n/config";
import type { Package } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/format";
import { gradientFor } from "@/lib/accent";

export default function PackageCard({
  pkg,
  locale,
  t,
  currency,
}: {
  pkg: Package;
  locale: Locale;
  t: Dictionary;
  currency: string;
}) {
  return (
    <Link
      href={`/${locale}/packages/${pkg.id}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-white/20"
    >
      <div
        className={`relative h-32 bg-gradient-to-br ${gradientFor(pkg.accent)}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
        <div className="absolute inset-0 flex items-end justify-between p-4">
          <span className="font-display text-3xl font-black text-white/90 drop-shadow">
            {pkg.hotelStars}★
          </span>
          {pkg.popular && (
            <span className="chip border-white/30 bg-black/30 text-white">
              ★ {t.common.popular}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold leading-snug">
          {localized(pkg.name, locale)}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-3">
          {localized(pkg.summary, locale)}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="chip">📍 {pkg.city}</span>
          <span className="chip">
            🛏️ {pkg.nights} {pkg.nights === 1 ? t.common.night : t.common.nights}
          </span>
          {pkg.date && (
            <span className="chip">📅 {formatDate(pkg.date, locale)}</span>
          )}
          {pkg.region && (
            <span className="chip">
              🌍 {t.regions[pkg.region as keyof Dictionary["regions"]] ?? pkg.region}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-3">
          <div>
            <div className="text-xs text-slate-400">{t.common.from}</div>
            <div className="font-display text-xl font-bold text-white">
              {formatPrice(pkg.priceFrom, currency, locale)}
            </div>
            <div className="text-xs text-slate-500">{t.common.perPerson}</div>
          </div>
          <span className="btn-ghost px-4 py-2 text-xs group-hover:bg-white/10">
            {t.common.viewDetails} →
          </span>
        </div>
      </div>
    </Link>
  );
}
