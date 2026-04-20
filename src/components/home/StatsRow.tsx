export type StatItem = { value: number; label: string; suffix?: string };

const DEFAULT_STATS: StatItem[] = [
  { value: 240, label: "Works", suffix: "+" },
  { value: 18, label: "Exhibitions" },
  { value: 12, label: "Awards" },
  { value: 8, label: "Experience", suffix: " yrs" },
];

function formatStat(s: StatItem): string {
  const base = new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(
    s.value
  );
  return `${base}${s.suffix ?? ""}`;
}

export function StatsRow({ stats = DEFAULT_STATS }: { stats?: StatItem[] }) {
  const visible = (stats ?? []).filter((s) => Number(s.value) > 0);
  if (visible.length === 0) return null;
  const items = visible.slice(0, 4);
  const n = items.length;
  const baseCols = n === 1 ? "grid-cols-1" : "grid-cols-2";
  const mdCols = n === 1 ? 1 : n === 2 ? 2 : n === 3 ? 3 : 4;
  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)]/60">
      <div
        className={`container-narrow grid ${baseCols} ${
          mdCols === 1
            ? "md:grid-cols-1"
            : mdCols === 2
              ? "md:grid-cols-2"
              : mdCols === 3
                ? "md:grid-cols-3"
                : "md:grid-cols-4"
        }`}
      >
        {items.map((s, i) => {
          const colsBase = n === 1 ? 1 : 2;
          const isLastColBase = colsBase === 1 ? true : (i + 1) % colsBase === 0;
          const isLastRowBase = i >= n - colsBase;

          const isLastColMd = mdCols === 1 ? true : (i + 1) % mdCols === 0;
          const isLastRowMd = i >= n - mdCols;

          return (
          <div
            key={s.label}
            className={[
              "flex flex-col items-center justify-center border-[var(--border)] px-4 py-12 md:py-16",
              // Base (mobile)
              !isLastColBase ? "border-r" : "",
              !isLastRowBase ? "border-b" : "",
              // md+
              !isLastColMd ? "md:border-r" : "md:border-r-0",
              !isLastRowMd ? "md:border-b" : "md:border-b-0",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <p className="font-display text-3xl font-light tabular-nums text-[var(--foreground)] md:text-4xl">
              {formatStat(s)}
            </p>
            <p className="label-caps mt-3 max-w-[12rem] text-center text-[var(--muted)]">
              {s.label}
            </p>
          </div>
          );
        })}
      </div>
    </section>
  );
}
