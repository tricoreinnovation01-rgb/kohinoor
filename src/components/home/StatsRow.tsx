const STATS = [
  { value: "240+", label: "Works" },
  { value: "18", label: "Exhibitions" },
  { value: "12", label: "Awards" },
  { value: "8 yrs", label: "Experience" },
] as const;

export function StatsRow() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]/60">
      <div className="container-narrow grid grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col items-center justify-center border-[var(--border)] px-4 py-12 md:py-16 ${
              i % 2 === 0 ? "border-r" : ""
            } ${i < 2 ? "border-b md:border-b-0" : ""} ${
              i < 3 ? "md:border-r" : ""
            }`}
          >
            <p className="font-display text-3xl font-light tabular-nums text-[var(--foreground)] md:text-4xl">
              {s.value}
            </p>
            <p className="label-caps mt-3 max-w-[12rem] text-center text-[var(--muted)]">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
