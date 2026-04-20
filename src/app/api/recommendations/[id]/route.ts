import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getRecommendedArtworks } from "@/lib/recommendations";
import mongoose from "mongoose";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const items = await getRecommendedArtworks(new mongoose.Types.ObjectId(id));
    return NextResponse.json({ items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
