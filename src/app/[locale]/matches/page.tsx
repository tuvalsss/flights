import { getDictionary, type Locale } from "@/i18n/config";
import { getMatches } from "@/lib/store";
import MatchExplorer from "@/components/MatchExplorer";

export const dynamic = "force-dynamic";

export default async function MatchesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const t = getDictionary(params.locale);
  const matches = await getMatches();

  return (
    <div className="container-page py-14">
      <header className="max-w-2xl">
        <h1 className="section-title">{t.matches.title}</h1>
        <p className="mt-3 text-slate-400">{t.matches.subtitle}</p>
      </header>
      <div className="mt-10">
        <MatchExplorer matches={matches} locale={params.locale} t={t} />
      </div>
    </div>
  );
}
