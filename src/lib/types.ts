import type { Locale } from "@/i18n/config";

export type LocalizedText = Partial<Record<Locale, string>>;

export interface Match {
  id: string;
  stage: string;
  homeTeam: string;
  homeCode: string;
  awayTeam: string;
  awayCode: string;
  group: string;
  date: string;
  kickoff: string;
  venue: string;
  city: string;
  country: string;
  region: string;
  featured: boolean;
}

export interface Package {
  id: string;
  matchId: string;
  category: string;
  city: string;
  country: string;
  region: string;
  date: string;
  endDate: string;
  nights: number;
  hotelStars: number;
  hotelName: string;
  board: string;
  priceFrom: number;
  popular: boolean;
  accent: string;
  image: string;
  name: LocalizedText;
  summary: LocalizedText;
  includes: Partial<Record<Locale, string[]>>;
}

export interface Settings {
  brand: string;
  tagline: LocalizedText;
  heroKicker: LocalizedText;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  currency: string;
  stats: {
    teams: number;
    matches: number;
    cities: number;
    countries: number;
  };
  social: {
    instagram: string;
    facebook: string;
    x: string;
  };
  defaultLocale: string;
  locales: string[];
}

export type OrderStatus = "pending" | "paid" | "demo" | "cancelled";

export interface Order {
  id: string;
  reference: string;
  packageId: string;
  packageName: string;
  guests: number;
  unitPrice: number;
  total: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCountry: string;
  status: OrderStatus;
  locale: string;
  createdAt: string;
}
