"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkCredentials,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  isAuthenticated,
} from "@/lib/auth";
import {
  getMatches,
  saveMatches,
  getPackages,
  savePackages,
  getSettings,
  saveSettings,
  getOrders,
  updateOrder,
} from "@/lib/store";
import { locales, type Locale } from "@/i18n/config";
import type { Match, Order, OrderStatus, Package } from "@/lib/types";

function guard() {
  if (!isAuthenticated()) redirect("/admin/login");
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function num(fd: FormData, key: string): number {
  return Number(fd.get(key) ?? 0) || 0;
}

function localizedFrom(fd: FormData, prefix: string): Record<Locale, string> {
  const out = {} as Record<Locale, string>;
  for (const l of locales) out[l] = str(fd, `${prefix}_${l}`);
  return out;
}

function refreshAll() {
  revalidatePath("/", "layout");
}

/* ── Auth ───────────────────────────────────────────────── */

export async function loginAction(fd: FormData) {
  const username = str(fd, "username");
  const password = str(fd, "password");
  if (!checkCredentials(username, password)) {
    redirect("/admin/login?error=1");
  }
  setSessionCookie(createSessionToken());
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  clearSessionCookie();
  redirect("/admin/login");
}

/* ── Matches ────────────────────────────────────────────── */

export async function saveMatchAction(fd: FormData) {
  guard();
  const matches = await getMatches();
  const id = str(fd, "id");
  const record: Match = {
    id: id || "m" + Date.now().toString(36),
    stage: str(fd, "stage") || "group",
    homeTeam: str(fd, "homeTeam"),
    homeCode: str(fd, "homeCode").toUpperCase(),
    awayTeam: str(fd, "awayTeam"),
    awayCode: str(fd, "awayCode").toUpperCase(),
    group: str(fd, "group"),
    date: str(fd, "date"),
    kickoff: str(fd, "kickoff"),
    venue: str(fd, "venue"),
    city: str(fd, "city"),
    country: str(fd, "country"),
    featured: fd.get("featured") === "on",
  };
  const idx = matches.findIndex((m) => m.id === record.id);
  if (idx === -1) matches.push(record);
  else matches[idx] = record;
  await saveMatches(matches);
  refreshAll();
  redirect("/admin/matches");
}

export async function deleteMatchAction(fd: FormData) {
  guard();
  const id = str(fd, "id");
  const matches = (await getMatches()).filter((m) => m.id !== id);
  await saveMatches(matches);
  refreshAll();
  redirect("/admin/matches");
}

/* ── Packages ───────────────────────────────────────────── */

export async function savePackageAction(fd: FormData) {
  guard();
  const packages = await getPackages();
  const id = str(fd, "id");
  const includes = {} as Record<Locale, string[]>;
  for (const l of locales) {
    includes[l] = str(fd, `includes_${l}`)
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const record: Package = {
    id: id || "pkg-" + Date.now().toString(36),
    matchId: str(fd, "matchId"),
    category: str(fd, "category") || "group",
    city: str(fd, "city"),
    country: str(fd, "country"),
    nights: num(fd, "nights"),
    hotelStars: num(fd, "hotelStars"),
    priceFrom: num(fd, "priceFrom"),
    popular: fd.get("popular") === "on",
    accent: str(fd, "accent") || "pitch",
    image: str(fd, "image") || "default",
    name: localizedFrom(fd, "name"),
    summary: localizedFrom(fd, "summary"),
    includes,
  };
  const idx = packages.findIndex((p) => p.id === record.id);
  if (idx === -1) packages.push(record);
  else packages[idx] = record;
  await savePackages(packages);
  refreshAll();
  redirect("/admin/packages");
}

export async function deletePackageAction(fd: FormData) {
  guard();
  const id = str(fd, "id");
  const packages = (await getPackages()).filter((p) => p.id !== id);
  await savePackages(packages);
  refreshAll();
  redirect("/admin/packages");
}

/* ── Orders ─────────────────────────────────────────────── */

export async function updateOrderStatusAction(fd: FormData) {
  guard();
  const id = str(fd, "id");
  const status = str(fd, "status") as OrderStatus;
  await updateOrder(id, { status });
  refreshAll();
  redirect("/admin/orders");
}

/* ── Settings ───────────────────────────────────────────── */

export async function saveSettingsAction(fd: FormData) {
  guard();
  const current = await getSettings();
  const next = {
    ...current,
    brand: str(fd, "brand") || current.brand,
    contactEmail: str(fd, "contactEmail"),
    contactPhone: str(fd, "contactPhone"),
    whatsapp: str(fd, "whatsapp"),
    currency: str(fd, "currency") || current.currency,
    tagline: localizedFrom(fd, "tagline"),
    heroKicker: localizedFrom(fd, "heroKicker"),
    stats: {
      teams: num(fd, "teams"),
      matches: num(fd, "matches"),
      cities: num(fd, "cities"),
      countries: num(fd, "countries"),
    },
  };
  await saveSettings(next);
  refreshAll();
  redirect("/admin/settings");
}
