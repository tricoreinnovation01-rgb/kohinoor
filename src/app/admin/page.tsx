import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import Artwork, { type ArtworkDoc } from "@/models/Artwork";
import Order from "@/models/Order";
import Customer from "@/models/Customer";
import { SeedDemoButton } from "@/components/admin/SeedDemoButton";
import { formatNprFromUsd } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  let artworks = 0;
  let orders = 0;
  let customers = 0;
  let revenue = 0;
  let recent: ArtworkDoc[] = [];
  try {
    await connectDB();
    const [ac, oc, cc, paid, rec] = await Promise.all([
      Artwork.countDocuments(),
      Order.countDocuments(),
      Customer.countDocuments(),
      Order.find({ status: "paid" }).select("total").lean<{ total: number }[]>(),
      Artwork.find().sort({ createdAt: -1 }).limit(8).lean<ArtworkDoc[]>(),
    ]);
    artworks = ac;
    orders = oc;
    customers = cc;
    revenue = paid.reduce((s, o) => s + (o.total ?? 0), 0);
    recent = rec;
  } catch {
    /* ignore */
  }

  const stat = (label: string, value: string, delta: string) => (
    <div className="border border-[var(--border)] bg-[var(--surface-card)] p-5">
      <p className="label-caps text-[var(--muted)]">{label}</p>
      <p className="font-display mt-2 text-2xl font-light md:text-3xl">{value}</p>
      <p className="mt-2 text-xs font-medium text-emerald-700">
        {delta}
      </p>
    </div>
  );

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-[var(--muted)]">Admin</p>
          <h1 className="font-display mt-2 text-3xl font-light md:text-4xl">
            Portfolio overview
          </h1>
        </div>
        <Link
          href="/admin/artworks/new"
          className="border border-[var(--foreground)] bg-[var(--foreground)] px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--background)] transition hover:opacity-90"
        >
          Add new
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stat("Revenue", formatNprFromUsd(revenue), "+12.4% vs last month")}
        {stat("Orders", String(orders), "+4.1% vs last month")}
        {stat("Artworks", String(artworks), "+2 new this week")}
        {stat("Customers", String(customers), "+8.2% vs last month")}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SeedDemoButton />
        </div>
        <div className="border border-[var(--border)] bg-[var(--surface-card)] p-5">
          <p className="label-caps text-[var(--muted)]">Tip</p>
          <p className="mt-3 text-sm font-light text-[var(--secondary)]">
            Replace demo images by uploading via{" "}
            <Link
              href="/admin/artworks"
              className="text-[var(--gold-deep)] underline-offset-4 hover:underline"
            >
              Artworks
            </Link>
            .
          </p>
          <Link
            href="/admin/stitch"
            className="label-caps mt-6 inline-block text-[var(--gold-deep)]"
          >
            Stitch MCP →
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-xl font-light">Recent artworks</h2>
        <div className="mt-6 overflow-x-auto border border-[var(--border)] bg-[var(--surface-card)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-[var(--border)] text-[var(--muted)]">
              <tr>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr
                  key={String(a._id)}
                  className="border-b border-[var(--border)] last:border-b-0"
                >
                  <td className="p-4">
                    <div className="relative h-12 w-12 overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
                      <Image
                        src={a.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium">{a.title}</td>
                  <td className="p-4 capitalize text-[var(--secondary)]">
                    {a.category}
                  </td>
                  <td className="p-4">{formatNprFromUsd(a.price)}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        a.sold
                          ? "bg-orange-100 text-orange-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {a.sold ? "Sold" : "Available"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/artworks/${a._id}/edit`}
                      className="text-[var(--gold-deep)]"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
