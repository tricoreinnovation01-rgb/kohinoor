import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthFromCookies } from "@/lib/auth";
import Artwork from "@/models/Artwork";
import { slugify } from "@/lib/slug";

const DEMO = [
  {
    title: "Still Water, 01",
    description: "A quiet study in negative space and weightless form.",
    price: 950,
    imageUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1600&q=85&auto=format&fit=crop",
    category: "painting" as const,
    tags: ["minimal", "oil", "calm", "gallery"],
    featured: true,
  },
  {
    title: "Graphite Notes",
    description: "Gesture and restraint. Graphite on paper.",
    price: 280,
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1600&q=85&auto=format&fit=crop",
    category: "sketch" as const,
    tags: ["graphite", "line", "study"],
    featured: true,
  },
  {
    title: "Bloom Field",
    description: "Digital light mapped into soft color and texture.",
    price: 520,
    imageUrl:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1600&q=85&auto=format&fit=crop",
    category: "digital" as const,
    tags: ["digital", "abstract", "color"],
    featured: true,
  },
  {
    title: "Midnight Paper",
    description: "Charcoal density, thin edges, deep contrast.",
    price: 340,
    imageUrl:
      "https://images.unsplash.com/photo-1541414779736-7fdae8d2f977?w=1600&q=85&auto=format&fit=crop",
    category: "sketch" as const,
    tags: ["charcoal", "contrast", "mono"],
    featured: false,
  },
  {
    title: "Soft Geometry",
    description: "A structured composition with a gentle, imperfect grid.",
    price: 1100,
    imageUrl:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=1600&q=85&auto=format&fit=crop",
    category: "painting" as const,
    tags: ["geometry", "minimal", "composition"],
    featured: false,
  },
  {
    title: "Glass & Shadow",
    description: "A study of reflection and quiet contrast.",
    price: 460,
    imageUrl:
      "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0d?w=1600&q=85&auto=format&fit=crop",
    category: "photography" as const,
    tags: ["photography", "shadow", "architecture"],
    featured: false,
  },
  {
    title: "Mixed Silence",
    description: "Layered marks, paper grain, and softened edges.",
    price: 690,
    imageUrl:
      "https://images.unsplash.com/photo-1458530970867-aaa3700e966d?w=1600&q=85&auto=format&fit=crop",
    category: "mixed" as const,
    tags: ["mixed-media", "texture", "paper"],
    featured: false,
  },
  {
    title: "Blue Volume",
    description: "A limited palette piece designed for a clean wall.",
    price: 1300,
    imageUrl:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=1600&q=85&auto=format&fit=crop",
    category: "painting" as const,
    tags: ["blue", "modern", "statement"],
    featured: false,
  },
];

export async function POST() {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let created = 0;
    let updated = 0;

    for (const d of DEMO) {
      const base = slugify(d.title);
      const existing = await Artwork.findOne({ slug: base });
      if (existing) {
        await Artwork.updateOne(
          { _id: existing._id },
          { $set: { ...d, slug: base, publicId: existing.publicId ?? "" } }
        );
        updated += 1;
      } else {
        await Artwork.create({
          ...d,
          slug: base,
          publicId: "",
          sold: false,
        });
        created += 1;
      }
    }

    return NextResponse.json({ ok: true, created, updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}

