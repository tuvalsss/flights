import Link from "next/link";
import type { Locale, Dictionary } from "@/i18n/config";
import type { Match } from "@/lib/types";
import { flagEmoji } from "@/lib/flags";
import { formatDate, formatWeekday } from "@/lib/format";

const stageKey = (stage: string): keyof Dictionary["stages"] =>
  (["opening", "group", "round32", "round16", "quarterfinal", "semifinal", "thirdplace", "final"].includes(
    stage,
  )
    ? stage
    : "group") as keyof Dictionary["stages"];

export default function MatchCard({
  match,
  locale,
  t,
}: {
  match: Match;
  locale: Locale;
  t: Dictionary;
}) {
  const stageLabel = t.stages[stageKey(match.stage)];

  return (
    <Link
      href={`/${locale}/matches/${match.id}`}
      className="card group flex flex-col gap-4 p-5 transition hover:border-pitch-500/40 hover:bg-white/[0.06]"
    >
      <div className="flex items-center justify-between">
        <span className="chip border-pitch-500/30 bg-pitch-500/10 text-pitch-300">
          {stageLabel}
        </span>
        {match.group && (
          <span className="text-xs text-slate-400">
            {t.common.match} · {match.group}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 flex-col items-center gap-1 text-center">
          <span className="text-2xl" aria-hidden>
            {flagEmoji(match.homeCode)}
          </span>
          <span className="text-sm font-semibold">{match.homeTeam}</span>
        </div>
        <span className="text-xs font-bold uppercase text-slate-500">
          {t.common.vs}
        </span>
        <div className="flex flex-1 flex-col items-center gap-1 text-center">
          <span className="text-2xl" aria-hidden>
            {flagEmoji(match.awayCode)}
          </span>
          <span className="text-sm font-semibold">{match.awayTeam}</span>
        </div>
      </div>

      <div className="mt-auto space-y-1 border-t border-white/10 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span aria-hidden>📅</span>
          <span>
            {formatWeekday(match.date, locale)}, {formatDate(match.date, locale)} ·{" "}
            {match.kickoff}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span aria-hidden>📍</span>
          <span>
            {match.venue}, {match.city}
          </span>
        </div>
      </div>
    </Link>
  );
}
