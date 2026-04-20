import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { StatsRow } from "@/components/home/StatsRow";
import { ArtistIntro } from "@/components/home/ArtistIntro";
import { getFeaturedArtworks } from "@/lib/artworks-queries";
import { getHomeStats } from "@/lib/stats-queries";

export const revalidate = 60;

export default async function HomePage() {
  const raw = await getFeaturedArtworks(12);
  const dbStats = await getHomeStats();
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
      <StatsRow
        stats={[
          { value: dbStats?.works ?? 240, label: "Works", suffix: "+" },
          { value: dbStats?.exhibitions ?? 18, label: "Exhibitions" },
          { value: dbStats?.awards ?? 12, label: "Awards" },
          { value: dbStats?.experienceYears ?? 8, label: "Experience", suffix: " yrs" },
        ]}
      />
      <FeaturedGrid items={featured} />
      <ArtistIntro />
    </>
  );
}
