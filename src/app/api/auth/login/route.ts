import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { setAuthCookie, signAdminToken } from "@/lib/auth";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    try {
      await connectDB();
    } catch (dbErr) {
      const msg =
        dbErr instanceof Error ? dbErr.message : "Database connection failed";
      const refused =
        msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND");
      return NextResponse.json(
        {
          error: refused
            ? "Cannot reach MongoDB. Start MongoDB locally, or set MONGODB_URI in .env.local to MongoDB Atlas (see README)."
            : "Database unavailable. Check MONGODB_URI and try again.",
        },
        { status: 503 }
      );
    }
    const user = await User.findOne({ email: parsed.data.email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = signAdminToken(String(user._id), user.email);
    await setAuthCookie(token);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
