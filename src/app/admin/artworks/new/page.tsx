import { AdminShell } from "@/components/admin/AdminShell";
import { ArtworkForm } from "@/components/admin/ArtworkForm";

export default function NewArtworkPage() {
  return (
    <AdminShell>
      <h1 className="text-3xl font-light">New artwork</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Upload an image to Cloudinary, then save. Requires env keys.
      </p>
      <div className="mt-10">
        <ArtworkForm />
      </div>
    </AdminShell>
  );
}
