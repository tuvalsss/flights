import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDictionary,
  localized,
  type Locale,
  type Dictionary,
} from "@/i18n/config";
import {
  getPackageById,
  getPackages,
  getMatchById,
  getSettings,
} from "@/lib/store";
import { formatPrice, formatDate } from "@/lib/format";
import { gradientFor } from "@/lib/accent";
import { flagEmoji } from "@/lib/flags";
import PackageCard from "@/components/PackageCard";

export const dynamic = "force-dynamic";

export default async function PackageDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const t = getDictionary(locale);
  const pkg = await getPackageById(id);
  if (!pkg) notFound();

  const settings = await getSettings();
  const match = pkg.matchId ? await getMatchById(pkg.matchId) : undefined;
  const includes = pkg.includes[locale] ?? pkg.includes.en ?? [];
  const related = (await getPackages())
    .filter((p) => p.id !== pkg.id && p.category === pkg.category)
    .slice(0, 3);

  return (
    <div className="container-page py-14">
      <Link
        href={`/${locale}/packages`}
        className="text-sm text-slate-400 hover:text-white"
      >
        ← {t.nav.packages}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div
            className={`relative h-48 overflow-hidden rounded-3xl bg-gradient-to-br ${gradientFor(
              pkg.accent,
            )} sm:h-64`}
          >
            {pkg.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pkg.imageUrl}
                alt={localized(pkg.name, locale)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              {pkg.popular && (
                <span className="chip mb-3 w-fit border-white/30 bg-black/30 text-white">
                  ★ {t.common.popular}
                </span>
              )}
              <h1 className="font-display text-3xl font-black text-white sm:text-4xl">
                {localized(pkg.name, locale)}
              </h1>
            </div>
          </div>

          <p className="mt-6 text-lg text-slate-300">
            {localized(pkg.summary, locale)}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip">📍 {pkg.city}, {pkg.country}</span>
            <span className="chip">
              🛏️ {pkg.nights} {t.common.nights}
            </span>
            <span className="chip">
              {pkg.hotelStars}
              {t.packages.starsHotel}
            </span>
            <span className="chip">
              {t.stages[pkg.category as keyof Dictionary["stages"]] ?? pkg.category}
            </span>
          </div>

          <div className="card mt-8 p-6">
            <h2 className="font-display text-xl font-bold">{t.board.stay}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <StayRow
                icon="🏨"
                label={t.board.hotel}
                value={`${pkg.hotelName} · ${pkg.hotelStars}★`}
              />
              <StayRow
                icon="🍽️"
                label={t.board.label}
                value={t.board[pkg.board as keyof Dictionary["board"]] ?? pkg.board}
              />
              <StayRow
                icon="📅"
                label={t.board.checkIn}
                value={formatDate(pkg.date, locale)}
              />
              <StayRow
                icon="📅"
                label={t.board.checkOut}
                value={formatDate(pkg.endDate, locale)}
              />
            </div>
          </div>

          <h2 className="mt-10 font-display text-xl font-bold">
            {t.packages.detailIncludes}
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {includes.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pitch-500/20 text-pitch-300">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          {match && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-bold">
                {t.packages.detailMatch}
              </h2>
              <Link
                href={`/${locale}/matches/${match.id}`}
                className="card mt-4 flex items-center justify-between gap-4 p-5 hover:border-pitch-500/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>
                    {flagEmoji(match.homeCode)}
                  </span>
                  <span className="font-semibold">{match.homeTeam}</span>
                  <span className="text-xs text-slate-500">{t.common.vs}</span>
                  <span className="font-semibold">{match.awayTeam}</span>
                  <span className="text-2xl" aria-hidden>
                    {flagEmoji(match.awayCode)}
                  </span>
                </div>
                <span className="hidden text-xs text-slate-400 sm:block">
                  {formatDate(match.date, locale)} · {match.city}
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Sticky booking card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <div className="text-xs text-slate-400">{t.common.from}</div>
            <div className="font-display text-4xl font-black gradient-text">
              {formatPrice(pkg.priceFrom, settings.currency, locale)}
            </div>
            <div className="text-sm text-slate-400">{t.common.perPerson}</div>

            <Link
              href={`/${locale}/checkout/${pkg.id}`}
              className="btn-gold mt-6 w-full py-3 text-base"
            >
              {t.packages.bookCta}
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span aria-hidden>🔒</span>
              {t.common.secure}
            </div>

            <ul className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm text-slate-300">
              {includes.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-pitch-400">✓</span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title">{t.packages.relatedTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PackageCard
                key={p.id}
                pkg={p}
                locale={locale}
                t={t}
                currency={settings.currency}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StayRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-lg">
        {icon}
      </span>
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <div className="text-sm font-medium text-slate-100">{value}</div>
      </div>
    </div>
  );
}
