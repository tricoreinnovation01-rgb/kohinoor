import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/portfolio",
    "/shop",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  let works: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const docs = await Artwork.find().select("slug updatedAt").lean();
    works = docs.map((a) => ({
      url: `${base}/work/${a.slug}`,
      lastModified: a.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    /* no DB at build */
  }

  return [...staticPages, ...works];
}
