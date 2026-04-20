import { AdminShell } from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import HomeArtistIntro from "@/models/HomeArtistIntro";
import { HomeIntroEditor } from "@/components/admin/HomeIntroEditor";
import type { HomeArtistIntroContent } from "@/types/home-intro";

export const dynamic = "force-dynamic";

export default async function AdminHomeIntroPage() {
  let initial: HomeArtistIntroContent | null = null;
  try {
    await connectDB();
    const doc = await HomeArtistIntro.findOne({ key: "home-artist-intro" })
      .select(
        "imageUrl imageAlt name roleLine eyebrow headline headlineEmphasis body quote signature"
      )
      .lean<{
        imageUrl?: string;
        imageAlt?: string;
        name?: string;
        roleLine?: string;
        eyebrow?: string;
        headline?: string;
        headlineEmphasis?: string;
        body?: string;
        quote?: string;
        signature?: string;
      } | null>();
    initial = doc
      ? {
          imageUrl: String(doc.imageUrl ?? ""),
          imageAlt: String(doc.imageAlt ?? ""),
          name: String(doc.name ?? ""),
          roleLine: String(doc.roleLine ?? ""),
          eyebrow: String(doc.eyebrow ?? ""),
          headline: String(doc.headline ?? ""),
          headlineEmphasis: String(doc.headlineEmphasis ?? ""),
          body: String(doc.body ?? ""),
          quote: String(doc.quote ?? ""),
          signature: String(doc.signature ?? ""),
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
            Home artist intro
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-light text-[var(--secondary)]">
            Edit the “Kohinoor in the studio” section on the homepage.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <HomeIntroEditor initial={initial} />
      </div>
    </AdminShell>
  );
}

