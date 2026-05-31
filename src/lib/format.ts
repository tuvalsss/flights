import type { Locale } from "@/i18n/config";

const localeTag: Record<Locale, string> = {
  en: "en-US",
  ru: "ru-RU",
  es: "es-ES",
  ar: "ar",
};

export function formatPrice(
  amount: number,
  currency: string,
  locale: Locale = "en",
): string {
  try {
    return new Intl.NumberFormat(localeTag[locale] ?? "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatDate(iso: string, locale: Locale = "en"): string {
  try {
    return new Intl.DateTimeFormat(localeTag[locale] ?? "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso + "T00:00:00"));
  } catch {
    return iso;
  }
}

export function formatWeekday(iso: string, locale: Locale = "en"): string {
  try {
    return new Intl.DateTimeFormat(localeTag[locale] ?? "en-US", {
      weekday: "long",
    }).format(new Date(iso + "T00:00:00"));
  } catch {
    return "";
  }
}
