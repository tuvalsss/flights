import en from "./messages/en.json";
import ru from "./messages/ru.json";
import es from "./messages/es.json";
import ar from "./messages/ar.json";

export const locales = ["en", "ru", "es", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  es: "Español",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
  es: "🇪🇸",
  ar: "🇸🇦",
};

const dictionaries = { en, ru, es, ar } as const;

export type Dictionary = typeof en;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return (dictionaries[locale] ?? dictionaries[defaultLocale]) as Dictionary;
}

/** Resolve a localized value object ({en, ru, ...}) with graceful fallback. */
export function localized(
  field: Partial<Record<Locale, string>> | string | undefined,
  locale: Locale,
): string {
  if (field == null) return "";
  if (typeof field === "string") return field;
  return field[locale] ?? field[defaultLocale] ?? Object.values(field)[0] ?? "";
}
