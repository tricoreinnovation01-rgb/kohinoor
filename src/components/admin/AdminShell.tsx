import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <AdminNav />
      <div className="min-w-0 flex-1 pl-0 pt-14 md:pl-0 md:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10 lg:px-12">
          {children}
        </div>
      </div>
    </div>
  );
}
