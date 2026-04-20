import type { ArtworkDoc } from "@/models/Artwork";
import Artwork from "@/models/Artwork";
import type { Types } from "mongoose";
import { cacheGet, cacheSet } from "@/lib/server-cache";

/** Score similar artworks by category, tag overlap, and optional text similarity. */
export function scoreSimilarity(
  base: ArtworkDoc,
  candidate: ArtworkDoc
): number {
  if (String(candidate._id) === String(base._id)) return -1;
  let score = 0;
  if (candidate.category === base.category) score += 3;
  const baseTags = new Set((base.tags ?? []).map((t) => t.toLowerCase()));
  for (const t of candidate.tags ?? []) {
    if (baseTags.has(t.toLowerCase())) score += 2;
  }
  const words = new Set(
    `${base.title} ${base.description ?? ""}`
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2)
  );
  const candText = `${candidate.title} ${candidate.description ?? ""}`.toLowerCase();
  for (const w of words) {
    if (candText.includes(w)) score += 0.5;
  }
  return score;
}

export async function getRecommendedArtworks(
  artworkId: Types.ObjectId,
  limit = 4
): Promise<ArtworkDoc[]> {
  const key = `rec:${String(artworkId)}:${limit}`;
  const cached = cacheGet<ArtworkDoc[]>(key);
  if (cached) return cached;

  const base = await Artwork.findById(artworkId)
    .select("category tags title description")
    .lean<ArtworkDoc>();
  if (!base) return [];

  const tags = (base.tags ?? []).slice(0, 8);

  // Fast path: prefer same-category + tag overlap, newest first.
  const primary = await Artwork.find({
    _id: { $ne: artworkId },
    sold: false,
    category: base.category,
    ...(tags.length ? { tags: { $in: tags } } : {}),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("slug title description price imageUrl category tags sold createdAt")
    .lean<ArtworkDoc[]>();

  if (primary.length >= limit) {
    cacheSet(key, primary, 5 * 60_000);
    return primary;
  }

  const fallback = await Artwork.find({
    _id: { $nin: [artworkId, ...primary.map((r) => r._id)] },
    sold: false,
    category: base.category,
  })
    .sort({ createdAt: -1 })
    .limit(limit - primary.length)
    .select("slug title description price imageUrl category tags sold createdAt")
    .lean<ArtworkDoc[]>();

  const out = [...primary, ...fallback].slice(0, limit);
  cacheSet(key, out, 5 * 60_000);
  return out;
}
