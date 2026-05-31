"use client";

import { useMemo, useState } from "react";
import MatchCard from "./MatchCard";
import { Field, SearchInput, ResultsBar } from "./SearchControls";
import type { Locale, Dictionary } from "@/i18n/config";
import type { Match } from "@/lib/types";

const REGIONS = ["west", "central", "east"];
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
const TOUR_START = "2026-06-11";
const TOUR_END = "2026-07-19";

const EMPTY = { query: "", region: "", stage: "", from: "", to: "" };

export default function MatchExplorer({
  matches,
  locale,
  t,
}: {
  matches: Match[];
  locale: Locale;
  t: Dictionary;
}) {
  const [f, setF] = useState(EMPTY);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const stages = useMemo(() => {
    const present = new Set(matches.map((m) => m.stage));
    return STAGE_ORDER.filter((s) => present.has(s));
  }, [matches]);

  const filtered = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    return matches
      .filter((m) => {
        if (q) {
          const hay = [m.homeTeam, m.awayTeam, m.city, m.venue, m.country]
            .join(" ")
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (f.region && m.region !== f.region) return false;
        if (f.stage && m.stage !== f.stage) return false;
        if (f.from && m.date < f.from) return false;
        if (f.to && m.date > f.to) return false;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.kickoff.localeCompare(b.kickoff));
  }, [matches, f]);

  const dirty = JSON.stringify(f) !== JSON.stringify(EMPTY);

  return (
    <div>
      <div className="card p-5 sm:p-6">
        <SearchInput
          value={f.query}
          onChange={(v) => set("query", v)}
          placeholder={t.search.matchesPlaceholder}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={t.search.region}>
            <select
              className="input"
              value={f.region}
              onChange={(e) => set("region", e.target.value)}
            >
              <option value="">{t.search.allRegions}</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {t.regions[r as keyof Dictionary["regions"]]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.stages.group}>
            <select
              className="input"
              value={f.stage}
              onChange={(e) => set("stage", e.target.value)}
            >
              <option value="">{t.matches.filterAll}</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {t.stages[s as keyof Dictionary["stages"]]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.search.dateFrom}>
            <input
              type="date"
              className="input"
              min={TOUR_START}
              max={TOUR_END}
              value={f.from}
              onChange={(e) => set("from", e.target.value)}
            />
          </Field>

          <Field label={t.search.dateTo}>
            <input
              type="date"
              className="input"
              min={TOUR_START}
              max={TOUR_END}
              value={f.to}
              onChange={(e) => set("to", e.target.value)}
            />
          </Field>
        </div>

        <ResultsBar
          count={filtered.length}
          t={t}
          onReset={() => setF(EMPTY)}
          showReset={dirty}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">{t.search.noResults}</p>
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
