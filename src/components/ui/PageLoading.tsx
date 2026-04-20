export function PageLoading({ title }: { title?: string }) {
  return (
    <div className="container-narrow py-24">
      <p className="text-xs font-medium tracking-[0.25em] uppercase text-[var(--muted)]">
        {title ?? "Loading"}
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)]"
          />
        ))}
      </div>
    </div>
  );
}

