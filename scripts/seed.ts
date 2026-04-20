/**
 * Seed MongoDB with admin user + sample artworks.
 * Usage: npm run seed
 * Loads `.env.local` when present (via dotenv).
 */

import { config } from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../src/models/User";
import Artwork from "../src/models/Artwork";

config({ path: ".env.local" });
config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/diya-art";

const SAMPLES = [
  {
    title: "Morning Haze",
    slug: "morning-haze",
    description: "Oil on canvas. Soft gradients over a quiet horizon.",
    price: 1200,
    imageUrl:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80",
    category: "painting" as const,
    tags: ["oil", "landscape", "minimal"],
    featured: true,
  },
  {
    title: "Line Study 04",
    slug: "line-study-04",
    description: "Charcoal and graphite on paper.",
    price: 320,
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80",
    category: "sketch" as const,
    tags: ["charcoal", "figure"],
    featured: true,
  },
  {
    title: "Digital Bloom",
    slug: "digital-bloom",
    description: "Digital painting, archival print available.",
    price: 580,
    imageUrl:
      "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1200&q=80",
    category: "digital" as const,
    tags: ["digital", "color", "abstract"],
    featured: true,
  },
];

async function main() {
  console.info("Connecting to", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const email = "admin@diya.art";
  const password = "admin123";
  const passwordHash = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, name: "Admin", role: "admin" } },
    { upsert: true }
  );
  console.info("Admin user:", email, "/ password:", password);

  for (const s of SAMPLES) {
    await Artwork.findOneAndUpdate(
      { slug: s.slug },
      { $set: { ...s, publicId: "" } },
      { upsert: true }
    );
  }
  console.info("Seeded", SAMPLES.length, "artworks.");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
