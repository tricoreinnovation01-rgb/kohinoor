import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { getAuthFromCookies } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  imageUrl: z.string().url(),
  publicId: z.string().optional(),
  category: z.enum([
    "painting",
    "sketch",
    "digital",
    "sculpture",
    "photography",
    "mixed",
  ]),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    try {
      await connectDB();
    } catch {
      return NextResponse.json({ items: [], page: 1, limit: 24, hasMore: false });
    }
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const q = searchParams.get("q");
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit")) || 24));
    const filter: Record<string, unknown> = {};
    if (category && category !== "all") filter.category = category;
    if (featured === "true") filter.featured = true;
    if (q?.trim()) {
      const rx = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { title: rx },
        { description: rx },
        { tags: rx },
      ];
    }
    const skip = (page - 1) * limit;
    const docs = await Artwork.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .select("slug title description price imageUrl category tags featured sold createdAt")
      .lean();

    const hasMore = docs.length > limit;
    const items = hasMore ? docs.slice(0, limit) : docs;
    return NextResponse.json({ items, page, limit, hasMore });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const json = await req.json();
    const parsed = createSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const baseSlug = slugify(parsed.data.title);
    let slug = baseSlug;
    let n = 0;
    while (await Artwork.findOne({ slug })) {
      n += 1;
      slug = `${baseSlug}-${n}`;
    }
    const doc = await Artwork.create({
      ...parsed.data,
      slug,
      tags: parsed.data.tags ?? [],
    });
    return NextResponse.json(doc);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
