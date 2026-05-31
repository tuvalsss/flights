"use client";

import { useMemo, useState } from "react";
import MatchCard from "./MatchCard";
import type { Locale, Dictionary } from "@/i18n/config";
import type { Match } from "@/lib/types";

const STAGE_ORDER = [
  "opening",
  "group",
  "round32",
  "round16",
  "quarterfinal",
  "semifinal",
  "thirdplace",
  "final",
];

export default function MatchList({
  matches,
  locale,
  t,
}: {
  matches: Match[];
  locale: Locale;
  t: Dictionary;
}) {
  const [stage, setStage] = useState<string>("all");

  const stages = useMemo(() => {
    const present = new Set(matches.map((m) => m.stage));
    return STAGE_ORDER.filter((s) => present.has(s));
  }, [matches]);

  const filtered = useMemo(
    () => (stage === "all" ? matches : matches.filter((m) => m.stage === stage)),
    [matches, stage],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <FilterButton active={stage === "all"} onClick={() => setStage("all")}>
          {t.matches.filterAll}
        </FilterButton>
        {stages.map((s) => (
          <FilterButton
            key={s}
            active={stage === s}
            onClick={() => setStage(s)}
          >
            {t.stages[s as keyof Dictionary["stages"]]}
          </FilterButton>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">{t.matches.empty}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MatchCard key={m.id} match={m} locale={locale} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-pitch-500 text-white"
          : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
