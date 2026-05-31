"use client";

import { useMemo, useState } from "react";
import PackageCard from "./PackageCard";
import { Field, SearchInput, ResultsBar } from "./SearchControls";
import { localized, type Locale, type Dictionary } from "@/i18n/config";
import { formatPrice } from "@/lib/format";
import type { Package } from "@/lib/types";

const REGIONS = ["west", "central", "east", "multi"];
const PRICE_TIERS = [5000, 10000, 25000, 75000];

const TOUR_START = "2026-06-11";
const TOUR_END = "2026-07-19";

type Sort = "popular" | "priceLow" | "priceHigh" | "date";

const EMPTY = {
  query: "",
  region: "",
  from: "",
  to: "",
  maxPrice: "",
  sort: "popular" as Sort,
};

export default function PackageExplorer({
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
  const [f, setF] = useState(EMPTY);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const filtered = useMemo(() => {
    const q = f.query.trim().toLowerCase();
    const max = f.maxPrice ? Number(f.maxPrice) : Infinity;

    const list = packages.filter((p) => {
      if (q) {
        const hay = [
          localized(p.name, locale),
          localized(p.summary, locale),
          p.city,
          p.country,
          p.hotelName,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (f.region && p.region !== f.region) return false;
      if (f.from && p.endDate < f.from) return false;
      if (f.to && p.date > f.to) return false;
      if (p.priceFrom > max) return false;
      return true;
    });

    const sorted = [...list];
    switch (f.sort) {
      case "priceLow":
        sorted.sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "priceHigh":
        sorted.sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "date":
        sorted.sort((a, b) => a.date.localeCompare(b.date));
        break;
      default:
        sorted.sort(
          (a, b) =>
            Number(b.popular) - Number(a.popular) || a.priceFrom - b.priceFrom,
        );
    }
    return sorted;
  }, [packages, f, locale]);

  const dirty = JSON.stringify(f) !== JSON.stringify(EMPTY);

  return (
    <div>
      <div className="card p-5 sm:p-6">
        <SearchInput
          value={f.query}
          onChange={(v) => set("query", v)}
          placeholder={t.search.packagesPlaceholder}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

          <Field label={t.search.price}>
            <select
              className="input"
              value={f.maxPrice}
              onChange={(e) => set("maxPrice", e.target.value)}
            >
              <option value="">{t.search.anyPrice}</option>
              {PRICE_TIERS.map((p) => (
                <option key={p} value={p}>
                  ≤ {formatPrice(p, currency, locale)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.search.sort}>
            <select
              className="input"
              value={f.sort}
              onChange={(e) => set("sort", e.target.value)}
            >
              <option value="popular">{t.search.sortPopular}</option>
              <option value="priceLow">{t.search.sortPriceLow}</option>
              <option value="priceHigh">{t.search.sortPriceHigh}</option>
              <option value="date">{t.search.sortDate}</option>
            </select>
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
