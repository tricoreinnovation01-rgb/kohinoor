import { ShopClient } from "@/components/shop/ShopClient";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { connectDB } from "@/lib/mongodb";
import Artwork from "@/models/Artwork";
import type { ArtworkPublic } from "@/types/artwork";

export const revalidate = 60;

export const metadata = {
  title: "Shop",
  description: "Purchase original artworks — secure checkout with Stripe.",
};

export default async function ShopPage() {
  let initial: ArtworkPublic[] = [];
  try {
    await connectDB();
    const docs = await Artwork.find({ sold: false })
      .sort({ createdAt: -1 })
      .limit(48)
      .lean();
    initial = docs.map((a) => ({
      _id: String(a._id),
      slug: a.slug,
      title: a.title,
      description: a.description,
      price: a.price,
      imageUrl: a.imageUrl,
      category: a.category,
      tags: a.tags,
      sold: a.sold,
    }));
  } catch {
    /* empty */
  }

  return (
    <>
      <ShopClient initial={initial} />
      <CartDrawer />
    </>
  );
}
