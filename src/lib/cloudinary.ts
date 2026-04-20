import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary(): void {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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
