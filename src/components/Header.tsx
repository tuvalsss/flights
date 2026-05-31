"use client";

import Link from "next/link";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale, Dictionary } from "@/i18n/config";

export default function Header({
  locale,
  t,
  brand,
}: {
  locale: Locale;
  t: Dictionary;
  brand: string;
}) {
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;

  const links = [
    { href: `${base}`, label: t.nav.home },
    { href: `${base}/matches`, label: t.nav.matches },
    { href: `${base}/packages`, label: t.nav.packages },
    { href: `${base}/contact`, label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={base} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pitch-500 to-royal-600 text-lg shadow-lg">
            ⚽
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            {brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Link href={`${base}/packages`} className="btn-primary hidden sm:inline-flex">
            {t.nav.book}
          </Link>
          <button
            type="button"
            className="btn-ghost px-2.5 py-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-ink-950 md:hidden">
          <div className="container-page flex flex-col py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={`${base}/packages`}
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              {t.nav.book}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
