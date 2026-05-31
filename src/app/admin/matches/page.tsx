import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getMatches } from "@/lib/store";
import { saveMatchAction, deleteMatchAction } from "@/app/admin/actions";
import { flagEmoji } from "@/lib/flags";

export const dynamic = "force-dynamic";

const STAGES = [
  "opening",
  "group",
  "round32",
  "round16",
  "quarterfinal",
  "semifinal",
  "thirdplace",
  "final",
];

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const matches = await getMatches();
  const editing = searchParams.edit
    ? matches.find((m) => m.id === searchParams.edit)
    : undefined;
  const m = editing ?? {
    id: "",
    stage: "group",
    homeTeam: "",
    homeCode: "",
    awayTeam: "",
    awayCode: "",
    group: "",
    date: "",
    kickoff: "",
    venue: "",
    city: "",
    country: "",
    region: "central",
    featured: false,
  };

  return (
    <AdminShell active="/admin/matches" title="Matches">
      <form action={saveMatchAction} className="card mb-8 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {editing ? `Edit match · ${editing.id}` : "Add new match"}
          </h2>
          {editing && (
            <Link href="/admin/matches" className="text-xs text-slate-400 hover:text-white">
              + New instead
            </Link>
          )}
        </div>
        <input type="hidden" name="id" value={m.id} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Stage">
            <select name="stage" defaultValue={m.stage} className="input">
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Group">
            <input name="group" defaultValue={m.group} className="input" />
          </Field>
          <Field label="Date (YYYY-MM-DD)">
            <input name="date" defaultValue={m.date} className="input" placeholder="2026-06-11" />
          </Field>
          <Field label="Home team">
            <input name="homeTeam" defaultValue={m.homeTeam} className="input" />
          </Field>
          <Field label="Home code (ISO-2)">
            <input name="homeCode" defaultValue={m.homeCode} className="input" maxLength={2} />
          </Field>
          <Field label="Kick-off (HH:MM)">
            <input name="kickoff" defaultValue={m.kickoff} className="input" placeholder="19:00" />
          </Field>
          <Field label="Away team">
            <input name="awayTeam" defaultValue={m.awayTeam} className="input" />
          </Field>
          <Field label="Away code (ISO-2)">
            <input name="awayCode" defaultValue={m.awayCode} className="input" maxLength={2} />
          </Field>
          <Field label="Venue">
            <input name="venue" defaultValue={m.venue} className="input" />
          </Field>
          <Field label="City">
            <input name="city" defaultValue={m.city} className="input" />
          </Field>
          <Field label="Country">
            <input name="country" defaultValue={m.country} className="input" />
          </Field>
          <Field label="Region">
            <select name="region" defaultValue={m.region} className="input">
              <option value="west">West (Pacific)</option>
              <option value="central">Central (Mexico & Texas)</option>
              <option value="east">East (Atlantic)</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={m.featured}
              className="h-4 w-4 accent-pitch-500"
            />
            Featured on home page
          </label>
        </div>
        <button type="submit" className="btn-primary mt-5 px-6 py-2.5">
          {editing ? "Save changes" : "Add match"}
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Fixture</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {matches.map((mx) => (
              <tr key={mx.id} className="border-b border-white/5">
                <td className="px-4 py-3 text-slate-400">{mx.stage}</td>
                <td className="px-4 py-3">
                  {flagEmoji(mx.homeCode)} {mx.homeTeam} vs {mx.awayTeam}{" "}
                  {flagEmoji(mx.awayCode)}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {mx.date} {mx.kickoff}
                </td>
                <td className="px-4 py-3 text-slate-400">{mx.city}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/matches?edit=${mx.id}`}
                      className="text-pitch-300 hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteMatchAction}>
                      <input type="hidden" name="id" value={mx.id} />
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
