import type { Metadata } from "next";
import { headers } from "next/headers";
import { defaultLocale, isLocale, isRtl, type Locale } from "@/i18n/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlightsBook — FIFA World Cup 2026 Hospitality Packages",
  description:
    "Premium hospitality & travel packages for the FIFA World Cup 2026 across the USA, Mexico and Canada.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerLocale = headers().get("x-locale");
  const locale: Locale =
    headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale;
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
