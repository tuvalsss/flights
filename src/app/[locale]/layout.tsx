import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getDictionary,
  isLocale,
  locales,
  localized,
  type Locale,
} from "@/i18n/config";
import { getSettings } from "@/lib/store";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = getDictionary(params.locale);
  const settings = await getSettings();
  return {
    title: t.meta.title,
    description: localized(settings.tagline, params.locale) || t.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDictionary(locale);
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} t={t} brand={settings.brand} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} t={t} settings={settings} />
    </div>
  );
}
