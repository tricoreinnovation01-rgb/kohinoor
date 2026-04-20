import { AdminShell } from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import Customer, { type CustomerDoc } from "@/models/Customer";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  let items: CustomerDoc[] = [];
  try {
    await connectDB();
    items = await Customer.find()
      .sort({ updatedAt: -1 })
      .limit(200)
      .lean<CustomerDoc[]>();
  } catch {
    /* ignore */
  }

  return (
    <AdminShell>
      <h1 className="text-3xl font-light">Customers</h1>
      <div className="mt-10 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--muted)]">
            <tr>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Phone</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={String(c._id)} className="border-b border-[var(--border)]">
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.name || "—"}</td>
                <td className="p-4">{c.phone || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 && (
        <p className="mt-6 text-sm text-[var(--muted)]">No customers yet.</p>
      )}
    </AdminShell>
  );
}
