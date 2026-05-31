import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { loginAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (isAuthenticated()) redirect("/admin/dashboard");

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-pitch-500 to-royal-600 text-2xl">
            ⚽
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold">Admin console</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to manage FlightsBook
          </p>
        </div>

        <form action={loginAction} className="card space-y-4 p-6">
          {searchParams.error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              Invalid username or password.
            </p>
          )}
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>
            <input id="username" name="username" className="input" required autoFocus />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full py-2.5">
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-600">
          Configure credentials via ADMIN_USERNAME / ADMIN_PASSWORD env vars.
        </p>
      </div>
    </div>
  );
}
