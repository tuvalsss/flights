import AdminShell from "@/components/admin/AdminShell";
import { getOrders } from "@/lib/store";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { formatPrice, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "paid", "demo", "cancelled"];

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <AdminShell active="/admin/orders" title="Orders">
      {orders.length === 0 ? (
        <div className="card p-10 text-center text-slate-400">
          No orders yet. Orders placed on the site will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-sm font-bold text-pitch-300">
                    {o.reference}
                  </div>
                  <div className="mt-1 font-display text-lg font-bold">
                    {o.packageName}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {formatDate(o.createdAt.slice(0, 10))} · {o.locale.toUpperCase()}
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-display text-xl font-black gradient-text">
                    {formatPrice(o.total, o.currency)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {o.guests} × {formatPrice(o.unitPrice, o.currency)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Detail label="Customer" value={o.customerName} />
                <Detail label="Email" value={o.customerEmail} />
                <Detail label="Phone" value={o.customerPhone} />
                <Detail label="Country" value={o.customerCountry || "—"} />
              </div>

              <form
                action={updateOrderStatusAction}
                className="mt-4 flex items-center gap-3"
              >
                <input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status} className="input max-w-[180px]">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button className="btn-ghost px-4 py-2 text-sm">Update status</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 text-slate-200">{value}</div>
    </div>
  );
}
