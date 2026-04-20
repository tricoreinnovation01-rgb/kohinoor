import { connectDB } from "@/lib/mongodb";
import About, { type AboutDoc } from "@/models/About";
import { cacheGet, cacheSet } from "@/lib/server-cache";

export async function getAbout(): Promise<AboutDoc | null> {
  const cached = cacheGet<AboutDoc | null>("about:v1");
  if (cached) return cached;
  try {
    await connectDB();
    const doc = await About.findOne({ key: "about" }).lean<AboutDoc | null>();
    cacheSet("about:v1", doc, 30_000);
    return doc;
  } catch {
    return null;
  }
}

