import Link from "next/link";
import { headers } from "next/headers";
import { getDictionary, defaultLocale, isLocale, type Locale } from "@/i18n/config";

export default function LocaleNotFound() {
  const headerLocale = headers().get("x-locale");
  const locale: Locale =
    headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale;
  const t = getDictionary(locale);

  return (
    <div className="container-page py-28 text-center">
      <div className="font-display text-7xl font-black gradient-text">404</div>
      <h1 className="mt-4 font-display text-2xl font-bold">{t.notFound.title}</h1>
      <p className="mt-2 text-slate-400">{t.notFound.body}</p>
      <Link href={`/${locale}`} className="btn-primary mt-8 px-6 py-3">
        {t.notFound.back}
      </Link>
    </div>
  );
}
