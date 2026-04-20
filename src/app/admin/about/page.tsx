import { AdminShell } from "@/components/admin/AdminShell";
import { connectDB } from "@/lib/mongodb";
import About, { type AboutDoc } from "@/models/About";
import { AboutEditor } from "@/components/admin/AboutEditor";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  let initial: AboutDoc | null = null;
  try {
    await connectDB();
    initial = await About.findOne({ key: "about" }).lean<AboutDoc | null>();
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

