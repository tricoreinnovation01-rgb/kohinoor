import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import HomeStats from "@/models/HomeStats";
import { getAuthFromCookies } from "@/lib/auth";

const updateSchema = z.object({
  works: z.number().int().min(0).max(999999).optional(),
  exhibitions: z.number().int().min(0).max(999999).optional(),
  awards: z.number().int().min(0).max(999999).optional(),
  experienceYears: z.number().int().min(0).max(999).optional(),
});

export async function GET() {
  try {
    await connectDB();
    const doc = await HomeStats.findOne({ key: "home-stats" }).lean();
    return NextResponse.json({ stats: doc ?? null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ stats: null }, { status: 200 });
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
    const doc = await HomeStats.findOneAndUpdate(
      { key: "home-stats" },
      { $set: { key: "home-stats", ...parsed.data } },
      { upsert: true, new: true }
    ).lean();
    return NextResponse.json({ stats: doc });
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
    await HomeStats.deleteOne({ key: "home-stats" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

