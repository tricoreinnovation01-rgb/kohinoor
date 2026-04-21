import { AdminShell } from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import About from "@/models/About";
import { AboutEditor } from "@/components/admin/AboutEditor";
import type { AboutContent, AboutTimelineItem } from "@/types/about";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  let initial: AboutContent | null = null;
  try {
    await connectDB();
    const doc = await About.findOne({ key: "about" })
      .select(
        "heroTitle heroItalicWord bioP1 bioP2 portraitImageUrl quote quoteLabel silenceTitle silenceText silenceImageUrl timelineEyebrow timelineTitle timeline"
      )
      .lean<{
        heroTitle?: string;
        heroItalicWord?: string;
        bioP1?: string;
        bioP2?: string;
        portraitImageUrl?: string;
        quote?: string;
        quoteLabel?: string;
        silenceTitle?: string;
        silenceText?: string;
        silenceImageUrl?: string;
        timelineEyebrow?: string;
        timelineTitle?: string;
        timeline?: AboutTimelineItem[];
      } | null>();
    initial = doc
      ? {
          heroTitle: String(doc.heroTitle ?? ""),
          heroItalicWord: String(doc.heroItalicWord ?? ""),
          bioP1: String(doc.bioP1 ?? ""),
          bioP2: String(doc.bioP2 ?? ""),
          portraitImageUrl: String(doc.portraitImageUrl ?? ""),
          quote: String(doc.quote ?? ""),
          quoteLabel: String(doc.quoteLabel ?? ""),
          silenceTitle: String(doc.silenceTitle ?? ""),
          silenceText: String(doc.silenceText ?? ""),
          silenceImageUrl: String(doc.silenceImageUrl ?? ""),
          timelineEyebrow: String(doc.timelineEyebrow ?? ""),
          timelineTitle: String(doc.timelineTitle ?? ""),
          timeline: Array.isArray(doc.timeline) ? doc.timeline : [],
        }
      : null;
  } catch {
    /* ignore */
  }

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-[var(--muted)]">Admin</p>
          <h1 className="font-display mt-2 text-3xl font-light md:text-4xl">
            About page
          </h1>
        </div>
      </div>
      <div className="mt-10">
        <AboutEditor initial={initial} />
      </div>
    </AdminShell>
  );
}

