import Link from "next/link";
import type { Locale, Dictionary } from "@/i18n/config";
import type { Settings } from "@/lib/types";

export default function Footer({
  locale,
  t,
  settings,
}: {
  locale: Locale;
  t: Dictionary;
  settings: Settings;
}) {
  const base = `/${locale}`;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-950">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pitch-500 to-royal-600 text-lg">
              ⚽
            </span>
            <span className="font-display text-lg font-bold">
              {settings.brand}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            {t.footer.tagline}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{t.footer.explore}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>
              <Link href={`${base}/matches`} className="hover:text-white">
                {t.nav.matches}
              </Link>
            </li>
            <li>
              <Link href={`${base}/packages`} className="hover:text-white">
                {t.nav.packages}
              </Link>
            </li>
            <li>
              <Link href={`${base}/contact`} className="hover:text-white">
                {t.nav.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{t.footer.support}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-white">
                {settings.contactEmail}
              </a>
            </li>
            <li>
              <a href={`tel:${settings.contactPhone}`} className="hover:text-white">
                {settings.contactPhone}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">{t.footer.legal}</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-400">
            <li>
              <Link href={`${base}/legal/terms`} className="hover:text-white">
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <Link href={`${base}/legal/privacy`} className="hover:text-white">
                {t.footer.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.brand}. {t.footer.rights}
          </p>
          <p className="max-w-xl text-slate-600">{t.footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
