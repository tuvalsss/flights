"use client";

import type { Dictionary } from "@/i18n/config";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 start-0 grid w-11 place-items-center text-slate-500">
        🔍
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input ps-11"
        type="search"
      />
    </div>
  );
}

export function ResultsBar({
  count,
  t,
  onReset,
  showReset,
}: {
  count: number;
  t: Dictionary;
  onReset: () => void;
  showReset: boolean;
}) {
  return (
    <div className="mt-5 flex items-center justify-between">
      <p className="text-sm text-slate-400">
        {t.search.results.replace("{n}", String(count))}
      </p>
      {showReset && (
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-medium text-pitch-400 hover:text-pitch-300"
        >
          ↺ {t.search.reset}
        </button>
      )}
    </div>
  );
}
