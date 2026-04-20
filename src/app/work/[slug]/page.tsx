import { notFound } from "next/navigation";
import { WorkDetailClient } from "@/components/work/WorkDetailClient";
import { getArtworkBySlug } from "@/lib/artworks-queries";
import { connectDB } from "@/lib/mongodb";
import { getRecommendedArtworks } from "@/lib/recommendations";
import type { ArtworkPublic } from "@/types/artwork";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArtworkBySlug(slug);
  if (!a) return { title: "Artwork" };
  return {
    title: a.title,
    description: a.description?.slice(0, 160),
    openGraph: { images: a.imageUrl ? [a.imageUrl] : undefined },
  };
}

export const revalidate = 60;

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getArtworkBySlug(slug);
  if (!doc) notFound();

  const artwork: ArtworkPublic = {
    _id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    price: doc.price,
    imageUrl: doc.imageUrl,
    category: doc.category,
    tags: doc.tags,
    sold: doc.sold,
  };

  let related: ArtworkPublic[] = [];
  try {
    await connectDB();
    const rec = await getRecommendedArtworks(doc._id, 4);
    related = rec.map((r) => ({
      _id: String(r._id),
      slug: r.slug,
      title: r.title,
      description: r.description,
      price: r.price,
      imageUrl: r.imageUrl,
      category: r.category,
      tags: r.tags,
      sold: r.sold,
    }));
  } catch {
    /* ignore */
  }

  return <WorkDetailClient artwork={artwork} related={related} />;
}
