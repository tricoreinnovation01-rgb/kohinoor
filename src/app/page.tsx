import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { StatsRow } from "@/components/home/StatsRow";
import { ArtistIntro } from "@/components/home/ArtistIntro";
import { getFeaturedArtworks } from "@/lib/artworks-queries";
import { getHomeStats } from "@/lib/stats-queries";
import { getHomeArtistIntro } from "@/lib/home-intro-queries";
import type { HomeArtistIntroContent } from "@/types/home-intro";

export const revalidate = 60;

export default async function HomePage() {
  const raw = await getFeaturedArtworks(12);
  const dbStats = await getHomeStats();
  const dbIntro = await getHomeArtistIntro();
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

  const intro: HomeArtistIntroContent = {
    imageUrl:
      dbIntro?.imageUrl ??
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    imageAlt: dbIntro?.imageAlt ?? "Kohinoor in the studio",
    name: dbIntro?.name ?? "Kohinoor",
    roleLine: dbIntro?.roleLine ?? "Drawing artist & architectural designer",
    eyebrow: dbIntro?.eyebrow ?? "Artist",
    headline: dbIntro?.headline ?? "A dialogue between light and void.",
    headlineEmphasis: dbIntro?.headlineEmphasis ?? "light and void",
    body:
      dbIntro?.body ??
      "The studio treats drawing as architecture of attention — each line holds breath. Work moves between portraiture, botanical study, and abstract fields of graphite, always in service of stillness.",
    quote:
      dbIntro?.quote ??
      "The space between lines is where the masterpiece actually begins.",
    signature: dbIntro?.signature ?? "— Kohinoor",
  };

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
      <ArtistIntro content={intro} />
    </>
  );
}
