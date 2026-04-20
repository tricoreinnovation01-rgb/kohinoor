import { connectDB } from "@/lib/mongodb";
import Artwork, { type ArtworkDoc } from "@/models/Artwork";
import { cacheGet, cacheSet } from "@/lib/server-cache";

export async function getFeaturedArtworks(
  limit = 12
): Promise<ArtworkDoc[]> {
  try {
    const key = `featured:${limit}`;
    const cached = cacheGet<ArtworkDoc[]>(key);
    if (cached) return cached;
    await connectDB();
    const docs = await Artwork.find({ featured: true, sold: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("slug title description price imageUrl category tags featured sold createdAt")
      .lean<ArtworkDoc[]>();
    cacheSet(key, docs, 60_000);
    return docs;
  } catch {
    return [];
  }
}

export async function getArtworkBySlug(
  slug: string
): Promise<ArtworkDoc | null> {
  try {
    const key = `slug:${slug}`;
    const cached = cacheGet<ArtworkDoc | null>(key);
    if (cached) return cached;
    await connectDB();
    const doc = await Artwork.findOne({ slug })
      .select("slug title description price imageUrl category tags featured sold createdAt")
      .lean<ArtworkDoc | null>();
    cacheSet(key, doc, 60_000);
    return doc;
  } catch {
    return null;
  }
}
