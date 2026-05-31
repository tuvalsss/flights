"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  locales,
  localeNames,
  localeFlags,
  type Locale,
} from "@/i18n/config";

export default function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchTo(next: Locale) {
    setOpen(false);
    const segments = pathname.split("/");
    if ((locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join("/") || `/${next}`);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="chip hover:bg-white/10"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden>{localeFlags[locale]}</span>
        <span className="hidden sm:inline">{localeNames[locale]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <ul
            className="absolute end-0 z-40 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-xl"
            role="listbox"
          >
            {locales.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  onClick={() => switchTo(l)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 ${
                    l === locale ? "text-pitch-400" : "text-slate-200"
                  }`}
                  role="option"
                  aria-selected={l === locale}
                >
                  <span aria-hidden>{localeFlags[l]}</span>
                  {localeNames[l]}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
