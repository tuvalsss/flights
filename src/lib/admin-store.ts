import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const FILE = path.join(process.cwd(), "data", "admin.json");

export interface AdminCreds {
  username: string;
  salt: string;
  hash: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function build(username: string, password: string): AdminCreds {
  const salt = crypto.randomBytes(16).toString("hex");
  return { username, salt, hash: hashPassword(password, salt) };
}

async function persist(creds: AdminCreds): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(creds, null, 2) + "\n", "utf-8");
}

/**
 * Returns the stored admin credentials, seeding a default
 * (admin / 122122, or ADMIN_USERNAME / ADMIN_PASSWORD if provided)
 * on first run.
 */
export async function getAdminCreds(): Promise<AdminCreds> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as AdminCreds;
  } catch {
    const creds = build(
      process.env.ADMIN_USERNAME || "admin",
      process.env.ADMIN_PASSWORD || "122122",
    );
    await persist(creds);
    return creds;
  }
}

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const creds = await getAdminCreds();
  if (username !== creds.username) return false;
  const candidate = Buffer.from(hashPassword(password, creds.salt), "hex");
  const expected = Buffer.from(creds.hash, "hex");
  return (
    candidate.length === expected.length &&
    crypto.timingSafeEqual(candidate, expected)
  );
}

export async function setCredentials(
  username: string,
  password: string,
): Promise<void> {
  await persist(build(username, password));
}

export async function getAdminUsername(): Promise<string> {
  return (await getAdminCreds()).username;
}
