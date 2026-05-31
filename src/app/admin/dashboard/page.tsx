import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getMatches, getOrders, getPackages, getSettings } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [matches, packages, orders, settings] = await Promise.all([
    getMatches(),
    getPackages(),
    getOrders(),
    getSettings(),
  ]);

  const revenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const pipeline = orders
    .filter((o) => o.status === "paid" || o.status === "demo" || o.status === "pending")
    .reduce((sum, o) => sum + o.total, 0);

  const cards = [
    { label: "Matches", value: matches.length, href: "/admin/matches" },
    { label: "Packages", value: packages.length, href: "/admin/packages" },
    { label: "Orders", value: orders.length, href: "/admin/orders" },
    {
      label: "Paid revenue",
      value: formatPrice(revenue, settings.currency),
      href: "/admin/orders",
    },
  ];

  return (
    <AdminShell active="/admin/dashboard" title="Dashboard">
      <div
        className={`mb-6 rounded-xl border p-4 text-sm ${
          isStripeConfigured()
            ? "border-pitch-500/30 bg-pitch-500/10 text-pitch-300"
            : "border-gold-400/30 bg-gold-400/10 text-gold-300"
        }`}
      >
        {isStripeConfigured()
          ? "✓ Stripe is configured — live payments are enabled."
          : "⚠ Demo mode: set STRIPE_SECRET_KEY to enable live payments."}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 hover:border-white/20">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              {c.label}
            </div>
            <div className="mt-2 font-display text-2xl font-black gradient-text">
              {c.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Total pipeline (incl. pending & demo)
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {formatPrice(pipeline, settings.currency)}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-xs uppercase tracking-wide text-slate-400">
            Currency
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {settings.currency}
          </div>
        </div>
      </div>

      <h2 className="mt-10 mb-4 font-display text-lg font-bold">Recent orders</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-slate-400">No orders yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-b border-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-pitch-300">
                    {o.reference}
                  </td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3 text-slate-300">{o.packageName}</td>
                  <td className="px-4 py-3">
                    {formatPrice(o.total, o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-pitch-500/15 text-pitch-300",
    demo: "bg-gold-400/15 text-gold-300",
    pending: "bg-slate-500/15 text-slate-300",
    cancelled: "bg-red-500/15 text-red-300",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${map[status] ?? map.pending}`}>
      {status}
    </span>
  );
}
