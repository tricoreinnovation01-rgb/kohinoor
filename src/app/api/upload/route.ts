import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { uploadBuffer } from "@/lib/cloudinary";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getAuthFromCookies();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const name =
      (file as File).name?.replace(/\s+/g, "-") ?? `upload-${randomBytes(4).toString("hex")}.jpg`;
    const { url, public_id } = await uploadBuffer(buf, name);
    return NextResponse.json({ url, publicId: public_id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
