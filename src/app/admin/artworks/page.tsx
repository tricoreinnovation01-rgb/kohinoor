import { AdminShell } from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import Artwork, { type ArtworkDoc } from "@/models/Artwork";
import Link from "next/link";
import Image from "next/image";
import { formatNprFromUsd } from "@/lib/currency";

export const dynamic = "force-dynamic";

export default async function AdminArtworksPage() {
  let items: ArtworkDoc[] = [];
  try {
    await connectDB();
    items = await Artwork.find().sort({ createdAt: -1 }).limit(200).lean<ArtworkDoc[]>();
  } catch {
    /* ignore */
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-light">Artworks</h1>
        <Link
          href="/admin/artworks/new"
          className="rounded-full bg-[var(--foreground)] px-5 py-2 text-sm text-[var(--background)]"
        >
          Add artwork
        </Link>
      </div>
      <div className="mt-10 overflow-x-auto rounded-2xl border border-[var(--border)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--muted)]">
            <tr>
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={String(a._id)} className="border-b border-[var(--border)]">
                <td className="p-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-[var(--border)]">
                    <Image
                      src={a.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-medium">{a.title}</td>
                <td className="p-4 capitalize">{a.category}</td>
                <td className="p-4">{formatNprFromUsd(a.price)}</td>
                <td className="p-4">
                  <Link
                    href={`/admin/artworks/${a._id}/edit`}
                    className="text-[var(--accent)]"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
