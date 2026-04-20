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
    const msg = e instanceof Error ? e.message : "Upload failed";
    const isConfig =
      typeof msg === "string" &&
      (msg.includes("Cloudinary is not configured") ||
        msg.includes("CLOUDINARY_") ||
        msg.includes("cloud_name") ||
        msg.includes("api_key"));
    return NextResponse.json(
      { error: msg },
      { status: isConfig ? 503 : 500 }
    );
  }
}
