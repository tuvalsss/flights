import AdminShell from "@/components/admin/AdminShell";
import { getSettings } from "@/lib/store";
import { getAdminUsername } from "@/lib/admin-store";
import { saveSettingsAction, updateCredentialsAction } from "@/app/admin/actions";
import { locales, localeNames, type Locale } from "@/i18n/config";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: { credOk?: string; credErr?: string };
}) {
  const s = await getSettings();
  const adminUsername = await getAdminUsername();

  return (
    <AdminShell active="/admin/settings" title="Settings">
      <form action={saveSettingsAction} className="space-y-6">
        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Brand & contact</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Brand name">
              <input name="brand" defaultValue={s.brand} className="input" />
            </Field>
            <Field label="Currency (ISO)">
              <input name="currency" defaultValue={s.currency} className="input" />
            </Field>
            <Field label="Contact email">
              <input name="contactEmail" defaultValue={s.contactEmail} className="input" />
            </Field>
            <Field label="Contact phone">
              <input name="contactPhone" defaultValue={s.contactPhone} className="input" />
            </Field>
            <Field label="WhatsApp">
              <input name="whatsapp" defaultValue={s.whatsapp} className="input" />
            </Field>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Home stats</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Teams">
              <input name="teams" type="number" defaultValue={s.stats.teams} className="input" />
            </Field>
            <Field label="Matches">
              <input name="matches" type="number" defaultValue={s.stats.matches} className="input" />
            </Field>
            <Field label="Cities">
              <input name="cities" type="number" defaultValue={s.stats.cities} className="input" />
            </Field>
            <Field label="Countries">
              <input name="countries" type="number" defaultValue={s.stats.countries} className="input" />
            </Field>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display text-lg font-bold">
            Tagline & hero kicker (per language)
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {locales.map((l) => (
              <div key={l} className="rounded-xl border border-white/10 p-4">
                <h3 className="mb-3 text-sm font-semibold">
                  {localeNames[l as Locale]} ({l})
                </h3>
                <Field label="Tagline">
                  <input
                    name={`tagline_${l}`}
                    defaultValue={s.tagline[l as Locale] ?? ""}
                    className="input"
                  />
                </Field>
                <div className="mt-3">
                  <Field label="Hero kicker">
                    <input
                      name={`heroKicker_${l}`}
                      defaultValue={s.heroKicker[l as Locale] ?? ""}
                      className="input"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="btn-primary px-6 py-2.5">
          Save settings
        </button>
      </form>

      <form action={updateCredentialsAction} className="card mt-6 p-6">
        <h2 className="mb-1 font-display text-lg font-bold">Admin credentials</h2>
        <p className="mb-4 text-sm text-slate-400">
          Change the username and password used to sign in to this console.
        </p>
        {searchParams.credOk && (
          <p className="mb-4 rounded-lg bg-pitch-500/10 px-3 py-2 text-sm text-pitch-300">
            ✓ Credentials updated.
          </p>
        )}
        {searchParams.credErr && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            Username must be 2+ and password 4+ characters.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New username">
            <input name="newUsername" defaultValue={adminUsername} className="input" required />
          </Field>
          <Field label="New password">
            <input name="newPassword" type="password" className="input" required minLength={4} />
          </Field>
        </div>
        <button type="submit" className="btn-primary mt-5 px-6 py-2.5">
          Update credentials
        </button>
      </form>
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
