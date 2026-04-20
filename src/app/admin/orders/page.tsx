import { AdminShell } from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import Order, { type OrderDoc } from "@/models/Order";
import { formatNprFromUsd } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let items: OrderDoc[] = [];
  try {
    await connectDB();
    items = await Order.find().sort({ createdAt: -1 }).limit(100).lean<OrderDoc[]>();
  } catch {
    /* ignore */
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-light">Orders</h1>
      <div className="mt-10 space-y-6">
        {items.map((o) => (
          <div
            key={String(o._id)}
            className="rounded-2xl border border-[var(--border)] p-6"
          >
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="font-mono text-xs text-[var(--muted)]">
                {String(o._id)}
              </span>
              <span
                className={
                  o.status === "paid"
                    ? "text-green-600"
                    : "text-[var(--muted)]"
                }
              >
                {o.status}
              </span>
            </div>
            <p className="mt-2 text-sm">{o.customerEmail}</p>
            <p className="mt-1 text-lg">{formatNprFromUsd(o.total)}</p>
            <ul className="mt-4 space-y-1 text-sm text-[var(--muted)]">
              {o.items.map((it, i) => (
                <li key={i}>
                  {it.title} × {it.quantity} @ {formatNprFromUsd(it.unitPrice)}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-[var(--muted)]">No orders yet.</p>
        )}
      </div>
    </AdminShell>
  );
}
