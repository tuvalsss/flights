import Link from "next/link";
import {
  getDictionary,
  localized,
  type Locale,
} from "@/i18n/config";
import { getMatches, getPackages, getSettings } from "@/lib/store";
import MatchCard from "@/components/MatchCard";
import PackageCard from "@/components/PackageCard";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = params.locale;
  const t = getDictionary(locale);
  const settings = await getSettings();
  const matches = await getMatches();
  const packages = await getPackages();

  const featuredMatches = matches.filter((m) => m.featured).slice(0, 6);
  const featuredPackages = [...packages]
    .sort((a, b) => Number(b.popular) - Number(a.popular))
    .slice(0, 6);

  const stats = [
    { value: settings.stats.teams, label: t.home.statsTeams },
    { value: settings.stats.matches, label: t.home.statsMatches },
    { value: settings.stats.cities, label: t.home.statsCities },
    { value: settings.stats.countries, label: t.home.statsCountries },
  ];

  const why = [
    { icon: "🥂", title: t.home.why1Title, body: t.home.why1Body },
    { icon: "🏟️", title: t.home.why2Title, body: t.home.why2Body },
    { icon: "🔒", title: t.home.why3Title, body: t.home.why3Body },
    { icon: "🌍", title: t.home.why4Title, body: t.home.why4Body },
  ];

  const steps = [t.home.how1, t.home.how2, t.home.how3, t.home.how4];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-stadium-grid bg-[size:48px_48px] opacity-40" />
        <div className="container-page relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="chip mx-auto border-gold-400/30 bg-gold-400/10 text-gold-300">
              🏆 {localized(settings.heroKicker, locale)}
            </span>
            <h1 className="mt-6 font-display text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              {t.home.heroTitle.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="gradient-text">
                {t.home.heroTitle.split(" ").slice(-2).join(" ")}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href={`/${locale}/packages`} className="btn-gold px-6 py-3 text-base">
                {t.home.heroCtaPrimary}
              </Link>
              <Link href={`/${locale}/matches`} className="btn-ghost px-6 py-3 text-base">
                {t.home.heroCtaSecondary}
              </Link>
            </div>
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="card px-4 py-5 text-center">
                <dt className="font-display text-3xl font-black gradient-text">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Featured matches */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t.home.featuredMatchesTitle}</h2>
            <p className="mt-2 text-slate-400">{t.home.featuredMatchesSubtitle}</p>
          </div>
          <Link
            href={`/${locale}/matches`}
            className="hidden shrink-0 text-sm font-semibold text-pitch-400 hover:text-pitch-300 sm:block"
          >
            {t.common.viewAll} →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredMatches.map((m) => (
            <MatchCard key={m.id} match={m} locale={locale} t={t} />
          ))}
        </div>
      </section>

      {/* Featured packages */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">{t.home.featuredPackagesTitle}</h2>
            <p className="mt-2 text-slate-400">{t.home.featuredPackagesSubtitle}</p>
          </div>
          <Link
            href={`/${locale}/packages`}
            className="hidden shrink-0 text-sm font-semibold text-pitch-400 hover:text-pitch-300 sm:block"
          >
            {t.common.viewAll} →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPackages.map((p) => (
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

      {/* Why */}
      <section className="container-page py-16">
        <h2 className="section-title text-center">{t.home.whyTitle}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w) => (
            <div key={w.title} className="card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-2xl">
                {w.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{w.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16">
        <h2 className="section-title text-center">{t.home.howTitle}</h2>
        <ol className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={i} className="card relative p-6">
              <span className="font-display text-4xl font-black text-white/10">
                0{i + 1}
              </span>
              <p className="mt-2 font-medium text-slate-200">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA banner */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-royal-700 via-royal-600 to-pitch-600 p-10 text-center sm:p-14">
          <div className="absolute inset-0 bg-stadium-grid bg-[size:40px_40px] opacity-20" />
          <div className="relative">
            <h2 className="font-display text-3xl font-black sm:text-4xl">
              {t.home.ctaBannerTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              {t.home.ctaBannerBody}
            </p>
            <Link
              href={`/${locale}/packages`}
              className="btn-gold mt-7 px-7 py-3 text-base"
            >
              {t.home.ctaBannerButton}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
