import { AdminShell } from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import HomeStats from "@/models/HomeStats";
import { StatsEditor } from "@/components/admin/StatsEditor";
import type { HomeStatsContent } from "@/types/stats";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  let initial: HomeStatsContent | null = null;
  try {
    await connectDB();
    const doc = await HomeStats.findOne({ key: "home-stats" })
      .select("works exhibitions awards experienceYears")
      .lean<{
        works: number;
        exhibitions: number;
        awards: number;
        experienceYears: number;
      } | null>();
    initial = doc
      ? {
          works: Number(doc.works ?? 0),
          exhibitions: Number(doc.exhibitions ?? 0),
          awards: Number(doc.awards ?? 0),
          experienceYears: Number(doc.experienceYears ?? 0),
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
            Home stats
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-light text-[var(--secondary)]">
            Update the numbers shown on the homepage. Set a value to 0 to hide it.
          </p>
        </div>
      </div>
      <div className="mt-10">
        <StatsEditor initial={initial} />
      </div>
    </AdminShell>
  );
}

