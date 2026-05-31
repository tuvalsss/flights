import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Match, Order, Package, Settings } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson(file: string, data: unknown): Promise<void> {
  const target = path.join(DATA_DIR, file);
  await fs.writeFile(target, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

/* ── Matches ─────────────────────────────────────────────── */

export async function getMatches(): Promise<Match[]> {
  return readJson<Match[]>("matches.json");
}

export async function getMatchById(id: string): Promise<Match | undefined> {
  const matches = await getMatches();
  return matches.find((m) => m.id === id);
}

export async function saveMatches(matches: Match[]): Promise<void> {
  await writeJson("matches.json", matches);
}

/* ── Packages ────────────────────────────────────────────── */

export async function getPackages(): Promise<Package[]> {
  return readJson<Package[]>("packages.json");
}

export async function getPackageById(id: string): Promise<Package | undefined> {
  const packages = await getPackages();
  return packages.find((p) => p.id === id);
}

export async function getPackagesForMatch(matchId: string): Promise<Package[]> {
  const packages = await getPackages();
  return packages.filter((p) => p.matchId === matchId);
}

export async function savePackages(packages: Package[]): Promise<void> {
  await writeJson("packages.json", packages);
}

/* ── Settings ────────────────────────────────────────────── */

export async function getSettings(): Promise<Settings> {
  return readJson<Settings>("settings.json");
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson("settings.json", settings);
}

/* ── Orders ──────────────────────────────────────────────── */

const ORDERS_FILE = "orders.json";

async function ensureOrdersFile(): Promise<void> {
  try {
    await fs.access(path.join(DATA_DIR, ORDERS_FILE));
  } catch {
    await writeJson(ORDERS_FILE, []);
  }
}

export async function getOrders(): Promise<Order[]> {
  await ensureOrdersFile();
  const orders = await readJson<Order[]>(ORDERS_FILE);
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrderByReference(
  reference: string,
): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find((o) => o.reference === reference);
}

export async function addOrder(order: Order): Promise<void> {
  await ensureOrdersFile();
  const orders = await readJson<Order[]>(ORDERS_FILE);
  orders.push(order);
  await writeJson(ORDERS_FILE, orders);
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order | undefined> {
  await ensureOrdersFile();
  const orders = await readJson<Order[]>(ORDERS_FILE);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  orders[idx] = { ...orders[idx], ...patch };
  await writeJson(ORDERS_FILE, orders);
  return orders[idx];
}

export async function updateOrderByReference(
  reference: string,
  patch: Partial<Order>,
): Promise<Order | undefined> {
  const orders = await getOrders();
  const found = orders.find((o) => o.reference === reference);
  if (!found) return undefined;
  return updateOrder(found.id, patch);
}
