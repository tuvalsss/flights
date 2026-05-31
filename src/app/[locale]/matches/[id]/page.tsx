import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, localized, type Locale, type Dictionary } from "@/i18n/config";
import { getMatchById, getPackagesForMatch, getPackages, getSettings } from "@/lib/store";
import { flagEmoji } from "@/lib/flags";
import { formatDate, formatWeekday } from "@/lib/format";
import PackageCard from "@/components/PackageCard";

export const dynamic = "force-dynamic";

export default async function MatchDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const t = getDictionary(locale);
  const match = await getMatchById(id);
  if (!match) notFound();

  const settings = await getSettings();
  let related = await getPackagesForMatch(id);
  if (related.length === 0) {
    related = (await getPackages())
      .filter((p) => p.category === match.stage || p.popular)
      .slice(0, 3);
  }

  const stageLabel =
    t.stages[(match.stage as keyof Dictionary["stages"]) ?? "group"] ??
    match.stage;

  return (
    <div className="container-page py-14">
      <Link
        href={`/${locale}/matches`}
        className="text-sm text-slate-400 hover:text-white"
      >
        ← {t.nav.matches}
      </Link>

      <div className="card mt-6 overflow-hidden">
        <div className="relative bg-gradient-to-r from-royal-700 to-pitch-600 p-8 sm:p-12">
          <div className="absolute inset-0 bg-stadium-grid bg-[size:40px_40px] opacity-20" />
          <div className="relative">
            <span className="chip border-white/30 bg-black/20 text-white">
              {stageLabel}
            </span>
            <div className="mt-6 flex items-center justify-center gap-6 sm:gap-12">
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-5xl sm:text-6xl" aria-hidden>
                  {flagEmoji(match.homeCode)}
                </span>
                <span className="font-display text-lg font-bold">
                  {match.homeTeam}
                </span>
              </div>
              <span className="font-display text-2xl font-black text-white/70">
                {t.common.vs}
              </span>
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-5xl sm:text-6xl" aria-hidden>
                  {flagEmoji(match.awayCode)}
                </span>
                <span className="font-display text-lg font-bold">
                  {match.awayTeam}
                </span>
              </div>
            </div>
          </div>
        </div>

        <dl className="grid gap-px bg-white/10 sm:grid-cols-3">
          <Info label="📅" value={`${formatWeekday(match.date, locale)}, ${formatDate(match.date, locale)}`} />
          <Info label={t.matches.kickoff} value={match.kickoff} />
          <Info label={t.common.venue} value={`${match.venue}, ${match.city}`} />
        </dl>
      </div>

      <section className="mt-14">
        <h2 className="section-title">{t.matches.viewPackages}</h2>
        <p className="mt-2 text-slate-400">{localized(settings.tagline, locale)}</p>
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
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-950 px-6 py-5">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-100">{value}</dd>
    </div>
  );
}
