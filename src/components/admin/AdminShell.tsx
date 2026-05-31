import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/matches", label: "Matches", icon: "⚽" },
  { href: "/admin/packages", label: "Packages", icon: "🎟️" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminShell({
  active,
  title,
  children,
}: {
  active: string;
  title: string;
  children: React.ReactNode;
}) {
  if (!isAuthenticated()) redirect("/admin/login");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-white/10 bg-ink-950 lg:border-b-0 lg:border-e">
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pitch-500 to-royal-600 text-lg">
            ⚽
          </span>
          <div>
            <div className="font-display font-bold leading-none">FlightsBook</div>
            <div className="text-xs text-slate-500">Admin console</div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                active === n.href
                  ? "bg-pitch-500/15 text-pitch-300"
                  : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span aria-hidden>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden px-3 lg:block">
          <form action={logoutAction}>
            <button className="w-full rounded-lg px-4 py-2.5 text-start text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white">
              ⏏ Log out
            </button>
          </form>
        </div>
        <div className="mt-2 px-6 pb-4 text-xs text-slate-600">
          <Link href="/en" className="hover:text-slate-400">
            ← View live site
          </Link>
        </div>
      </aside>

      <main className="p-6 lg:p-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <form action={logoutAction} className="lg:hidden">
            <button className="btn-ghost px-4 py-2 text-xs">Log out</button>
          </form>
        </div>
        {children}
      </main>
    </div>
  );
}
