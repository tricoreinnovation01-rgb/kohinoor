import { connectDB } from "@/lib/mongodb";
import HomeArtistIntro, { type HomeArtistIntroDoc } from "@/models/HomeArtistIntro";
import { cacheGet, cacheSet } from "@/lib/server-cache";

export async function getHomeArtistIntro(): Promise<HomeArtistIntroDoc | null> {
  const cached = cacheGet<HomeArtistIntroDoc | null>("home-artist-intro:v1");
  if (cached) return cached;
  try {
    await connectDB();
    const doc = await HomeArtistIntro.findOne({ key: "home-artist-intro" }).lean<HomeArtistIntroDoc | null>();
    cacheSet("home-artist-intro:v1", doc, 30_000);
    return doc;
  } catch {
    return null;
  }
}

