import { PortfolioClient } from "@/components/portfolio/PortfolioClient";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import type { ArtworkPublic } from "@/types/artwork";

export const revalidate = 60;

export const metadata = {
  title: "Works",
  description:
    "Kohinoor Artist — drawings, sketches, commissions, and archive.",
};

export default async function PortfolioPage() {
  let initialItems: ArtworkPublic[] = [];
  try {
    await connectDB();
    const docs = await Artwork.find()
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();
    initialItems = docs.map((a) => ({
      _id: String(a._id),
      slug: a.slug,
      title: a.title,
      description: a.description,
      price: a.price,
      imageUrl: a.imageUrl,
      category: a.category,
      tags: a.tags,
      featured: a.featured,
      sold: a.sold,
    }));
  } catch {
    /* empty */
  }

  return (
    <PortfolioClient initialItems={initialItems} />
  );
}
