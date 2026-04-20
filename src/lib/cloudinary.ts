import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary(): void {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME (or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME), CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export async function uploadBuffer(
  buffer: Buffer,
  filename: string
): Promise<{ url: string; public_id: string }> {
  configureCloudinary();
  const folder = process.env.CLOUDINARY_FOLDER ?? "diya-art";
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          public_id: filename.replace(/\.[^.]+$/, ""),
        },
        (err, result) => {
          if (err || !result) reject(err ?? new Error("Upload failed"));
          else resolve({ url: result.secure_url, public_id: result.public_id });
        }
      )
      .end(buffer);
  });
}

export async function deleteByPublicId(publicId: string): Promise<void> {
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId);
}
