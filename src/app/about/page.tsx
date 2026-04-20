import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutSilence } from "@/components/about/AboutSilence";
import { getAbout } from "@/lib/about-queries";
import type { AboutTimelineItem } from "@/types/about";

export const metadata = {
  title: "About",
  description: "Biography, practice, and exhibitions.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const about = await getAbout();
  const timeline: AboutTimelineItem[] =
    about?.timeline?.length
      ? about.timeline
      : [
          {
            year: "2024",
            title: "Solo exhibition",
            text: "Paper thresholds — new graphite and ink works, Kathmandu.",
            tag: "Solo",
          },
          {
            year: "2022",
            title: "Vienna residency",
            text: "Three months at a printmaking atelier; cross-disciplinary studies.",
            tag: "Residency",
          },
          {
            year: "2020",
            title: "London group show",
            text: "Contemporary drawing survey, curated booth alongside EU artists.",
            tag: "Group",
          },
          {
            year: "2017",
            title: "BFA Bucharest",
            text: "Fine arts degree with focus on figurative drawing and art history.",
            tag: "Education",
          },
        ];

  return (
    <div>
      <div className="pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-narrow">
          <AboutIntro
            heroTitle={about?.heroTitle ?? "A life in lines"}
            heroItalicWord={about?.heroItalicWord ?? "lines"}
            bioP1={
              about?.bioP1 ??
              "Born in Bucharest and rooted in Kathmandu, Kohinoor builds images where silence is material."
            }
            bioP2={
              about?.bioP2 ??
              "The studio welcomes collectors, curators, and first-time buyers. Each work ships with a certificate and conservation notes."
            }
            portraitImageUrl={
              about?.portraitImageUrl ??
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
            }
            quote={
              about?.quote ??
              "The space between lines is where the masterpiece actually begins."
            }
            quoteLabel={about?.quoteLabel ?? "Artist"}
          />
        </div>
      </div>
      <AboutSilence
        title={about?.silenceTitle ?? "The beauty of silence."}
        text={
          about?.silenceText ??
          "Objects, light, and the pause before the next mark — a meditation in charcoal and breath."
        }
        imageUrl={
          about?.silenceImageUrl ??
          "https://images.unsplash.com/photo-1610701596007-115028617dc2?w=1200&q=80"
        }
      />
      <AboutTimeline
        eyebrow={about?.timelineEyebrow ?? "The narrative arc"}
        title={about?.timelineTitle ?? "Exhibitions & milestones"}
        items={timeline}
      />
    </div>
  );
}
