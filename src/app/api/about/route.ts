import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";
import { getAuthFromCookies } from "@/lib/auth";

const timelineItem = z.object({
  year: z.string().min(1).max(10),
  title: z.string().min(1).max(120),
  text: z.string().min(1).max(400),
  tag: z.string().max(32).optional(),
});

const updateSchema = z.object({
  heroTitle: z.string().max(80).optional(),
  heroItalicWord: z.string().max(24).optional(),
  bioP1: z.string().max(1200).optional(),
  bioP2: z.string().max(1200).optional(),
  portraitImageUrl: z.string().url().optional().or(z.literal("")),
  quote: z.string().max(200).optional(),
  quoteLabel: z.string().max(32).optional(),
  silenceTitle: z.string().max(80).optional(),
  silenceText: z.string().max(400).optional(),
  silenceImageUrl: z.string().url().optional().or(z.literal("")),
  timelineEyebrow: z.string().max(40).optional(),
  timelineTitle: z.string().max(80).optional(),
  timeline: z.array(timelineItem).max(12).optional(),
});

export async function GET() {
  try {
    await connectDB();
    const doc = await About.findOne({ key: "about" }).lean();
    return NextResponse.json({ about: doc ?? null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ about: null }, { status: 200 });
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
    const doc = await About.findOneAndUpdate(
      { key: "about" },
      { $set: { key: "about", ...parsed.data } },
      { upsert: true, new: true }
    ).lean();
    return NextResponse.json({ about: doc });
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
    await About.deleteOne({ key: "about" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

