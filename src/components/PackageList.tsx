"use client";

import { useMemo, useState } from "react";
import PackageCard from "./PackageCard";
import type { Locale, Dictionary } from "@/i18n/config";
import type { Package } from "@/lib/types";

const CATEGORY_ORDER = [
  "opening",
  "group",
  "quarterfinal",
  "semifinal",
  "final",
];

export default function PackageList({
  packages,
  locale,
  t,
  currency,
}: {
  packages: Package[];
  locale: Locale;
  t: Dictionary;
  currency: string;
}) {
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const present = new Set(packages.map((p) => p.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [packages]);

  const filtered = useMemo(
    () =>
      category === "all"
        ? packages
        : packages.filter((p) => p.category === category),
    [packages, category],
  );

  const labelFor = (c: string): string =>
    c === "opening" || c === "group"
      ? t.stages[c as keyof Dictionary["stages"]]
      : t.stages[c as keyof Dictionary["stages"]];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            category === "all"
              ? "bg-pitch-500 text-white"
              : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          {t.packages.filterAll}
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === c
                ? "bg-pitch-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {labelFor(c)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">{t.packages.empty}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PackageCard
              key={p.id}
              pkg={p}
              locale={locale}
              t={t}
              currency={currency}
            />
          ))}
        </div>
      )}
    </div>
  );
}
