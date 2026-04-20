import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import { getAuthFromCookies } from "@/lib/auth";
import { deleteByPublicId } from "@/lib/cloudinary";
import { z } from "zod";
import mongoose from "mongoose";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  publicId: z.string().optional(),
  category: z
    .enum([
      "painting",
      "sketch",
      "digital",
      "sculpture",
      "photography",
      "mixed",
    ])
    .optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  sold: z.boolean().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const q = mongoose.isValidObjectId(id)
      ? { _id: id }
      : { slug: id };
    const artwork = await Artwork.findOne(q).lean();
    if (!artwork) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(artwork);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const json = await req.json();
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    await connectDB();
    const artwork = await Artwork.findByIdAndUpdate(id, parsed.data, {
      new: true,
    });
    if (!artwork) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(artwork);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (artwork.publicId) {
      try {
        await deleteByPublicId(artwork.publicId);
      } catch {
        /* ignore cloudinary errors */
      }
    }
    await artwork.deleteOne();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
