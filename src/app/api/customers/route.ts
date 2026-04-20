import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";
import { getAuthFromCookies } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 50));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Customer.find().sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Customer.countDocuments(),
    ]);
    return NextResponse.json({ items, total, page, limit });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
