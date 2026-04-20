import { AdminShell } from "@/components/admin/AdminShell";
import { ArtworkForm } from "@/components/admin/ArtworkForm";
import { connectDB } from "@/lib/mongodb";
import Artwork, { type ArtworkDoc } from "@/models/Artwork";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function EditArtworkPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const a = await Artwork.findById(id).lean<ArtworkDoc | null>();
  if (!a) notFound();

  return (
    <AdminShell>
      <h1 className="text-3xl font-light">Edit artwork</h1>
      <div className="mt-10">
        <ArtworkForm
          initial={{
            _id: String(a._id),
            title: a.title,
            description: a.description,
            price: a.price,
            imageUrl: a.imageUrl,
            publicId: a.publicId,
            category: a.category,
            tags: a.tags ?? [],
            featured: a.featured,
          }}
        />
      </div>
    </AdminShell>
  );
}
