import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { StatsRow } from "@/components/home/StatsRow";
import { ArtistIntro } from "@/components/home/ArtistIntro";
import { getFeaturedArtworks } from "@/lib/artworks-queries";

export const revalidate = 60;

export default async function HomePage() {
  const raw = await getFeaturedArtworks(12);
  const featured = raw.map((a) => ({
    _id: String(a._id),
    slug: a.slug,
    title: a.title,
    imageUrl: a.imageUrl,
    category: a.category,
    price: a.price,
    tags: a.tags,
  }));

  const heroFeatured = featured[0]
    ? {
        slug: featured[0].slug,
        title: featured[0].title,
        imageUrl: featured[0].imageUrl,
        category: featured[0].category,
        price: featured[0].price,
      }
    : null;

  return (
    <>
      <HeroSection featured={heroFeatured} />
      <StatsRow />
      <FeaturedGrid items={featured} />
      <ArtistIntro />
    </>
  );
}
