import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import HomeArtistIntro from "@/models/HomeArtistIntro";
import { getAuthFromCookies } from "@/lib/auth";

const updateSchema = z.object({
  imageUrl: z.string().url().optional().or(z.literal("")),
  imagePublicId: z.string().max(200).optional(),
  imageAlt: z.string().max(120).optional(),
  name: z.string().max(80).optional(),
  roleLine: z.string().max(120).optional(),
  eyebrow: z.string().max(32).optional(),
  headline: z.string().max(120).optional(),
  headlineEmphasis: z.string().max(60).optional(),
  body: z.string().max(1200).optional(),
  quote: z.string().max(240).optional(),
  signature: z.string().max(80).optional(),
});

export async function GET() {
  try {
    await connectDB();
    const doc = await HomeArtistIntro.findOne({ key: "home-artist-intro" }).lean();
    return NextResponse.json({ intro: doc ?? null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ intro: null }, { status: 200 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const json = await req.json();
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const doc = await HomeArtistIntro.findOneAndUpdate(
      { key: "home-artist-intro" },
      { $set: { key: "home-artist-intro", ...parsed.data } },
      { upsert: true, new: true }
    ).lean();
    return NextResponse.json({ intro: doc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    await HomeArtistIntro.deleteOne({ key: "home-artist-intro" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

