import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getPackages, getMatches } from "@/lib/store";
import { savePackageAction, deletePackageAction } from "@/app/admin/actions";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { formatPrice } from "@/lib/format";
import type { Package } from "@/lib/types";

export const dynamic = "force-dynamic";

const CATEGORIES = ["opening", "group", "quarterfinal", "semifinal", "final"];
const ACCENTS = ["pitch", "royal", "gold", "sunset"];

const EMPTY: Package = {
  id: "",
  matchId: "",
  category: "group",
  city: "",
  country: "",
  nights: 3,
  hotelStars: 4,
  priceFrom: 0,
  popular: false,
  accent: "pitch",
  image: "default",
  name: {},
  summary: {},
  includes: {},
};

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const [packages, matches] = await Promise.all([getPackages(), getMatches()]);
  const editing = searchParams.edit
    ? packages.find((p) => p.id === searchParams.edit)
    : undefined;
  const p = editing ?? EMPTY;

  return (
    <AdminShell active="/admin/packages" title="Packages">
      <form action={savePackageAction} className="card mb-8 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {editing ? `Edit package · ${editing.id}` : "Add new package"}
          </h2>
          {editing && (
            <Link href="/admin/packages" className="text-xs text-slate-400 hover:text-white">
              + New instead
            </Link>
          )}
        </div>
        <input type="hidden" name="id" value={p.id} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Price from (whole units)">
            <input name="priceFrom" type="number" defaultValue={p.priceFrom} className="input" />
          </Field>
          <Field label="Nights">
            <input name="nights" type="number" defaultValue={p.nights} className="input" />
          </Field>
          <Field label="Hotel stars">
            <input name="hotelStars" type="number" min={1} max={5} defaultValue={p.hotelStars} className="input" />
          </Field>
          <Field label="Category">
            <select name="category" defaultValue={p.category} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="City">
            <input name="city" defaultValue={p.city} className="input" />
          </Field>
          <Field label="Country">
            <input name="country" defaultValue={p.country} className="input" />
          </Field>
          <Field label="Accent colour">
            <select name="accent" defaultValue={p.accent} className="input">
              {ACCENTS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="Linked match (optional)">
            <select name="matchId" defaultValue={p.matchId} className="input">
              <option value="">— none —</option>
              {matches.map((mx) => (
                <option key={mx.id} value={mx.id}>
                  {mx.homeTeam} vs {mx.awayTeam}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input type="checkbox" name="popular" defaultChecked={p.popular} className="h-4 w-4 accent-pitch-500" />
            Mark as popular
          </label>
          <input type="hidden" name="image" value={p.image} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {locales.map((l) => (
            <div key={l} className="rounded-xl border border-white/10 p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-200">
                {localeNames[l as Locale]} ({l})
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="label">Name</span>
                  <input name={`name_${l}`} defaultValue={p.name[l as Locale] ?? ""} className="input" />
                </div>
                <div>
                  <span className="label">Summary</span>
                  <textarea name={`summary_${l}`} defaultValue={p.summary[l as Locale] ?? ""} className="input min-h-[60px]" />
                </div>
                <div>
                  <span className="label">Includes (one per line)</span>
                  <textarea
                    name={`includes_${l}`}
                    defaultValue={(p.includes[l as Locale] ?? []).join("\n")}
                    className="input min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-primary mt-6 px-6 py-2.5">
          {editing ? "Save changes" : "Add package"}
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name (EN)</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Price from</th>
              <th className="px-4 py-3">Popular</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {packages.map((pk) => (
              <tr key={pk.id} className="border-b border-white/5">
                <td className="px-4 py-3">{pk.name.en}</td>
                <td className="px-4 py-3 text-slate-400">{pk.city}</td>
                <td className="px-4 py-3">{formatPrice(pk.priceFrom, "USD")}</td>
                <td className="px-4 py-3">{pk.popular ? "★" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/packages?edit=${pk.id}`} className="text-pitch-300 hover:underline">
                      Edit
                    </Link>
                    <form action={deletePackageAction}>
                      <input type="hidden" name="id" value={pk.id} />
                      <button className="text-red-400 hover:underline">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}
