import { connectDB } from "@/lib/mongodb";
import HomeStats, { type HomeStatsDoc } from "@/models/HomeStats";
import { cacheGet, cacheSet } from "@/lib/server-cache";

export async function getHomeStats(): Promise<HomeStatsDoc | null> {
  const cached = cacheGet<HomeStatsDoc | null>("home-stats:v1");
  if (cached) return cached;
  try {
    await connectDB();
    const doc = await HomeStats.findOne({ key: "home-stats" }).lean<HomeStatsDoc | null>();
    cacheSet("home-stats:v1", doc, 30_000);
    return doc;
  } catch {
    return null;
  }
}

