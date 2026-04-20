import { Suspense } from "react";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-narrow flex min-h-[70vh] items-center justify-center py-16 text-sm text-[var(--muted)]">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
