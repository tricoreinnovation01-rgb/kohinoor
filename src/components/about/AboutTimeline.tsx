"use client";

export type AboutTimelineItem = {
  year: string;
  title: string;
  text: string;
  tag?: string;
};

export function AboutTimeline({
  eyebrow = "The narrative arc",
  title = "Exhibitions & milestones",
  items = [],
}: {
  eyebrow?: string;
  title?: string;
  items?: AboutTimelineItem[];
}) {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--surface)] py-24 md:py-32">
      <div className="container-narrow">
        <p className="label-caps text-[var(--gold-deep)]">{eyebrow}</p>
        <h2 className="font-display mt-4 text-3xl font-light md:text-4xl lg:text-5xl">
          {title}
        </h2>

        <div className="relative mt-16 md:mt-20">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)] md:left-[11px]"
            aria-hidden
          />
          <ul className="space-y-14 md:space-y-16">
            {items.map((e) => (
              <li
                key={e.year}
                className="relative grid gap-6 pl-10 md:grid-cols-[100px_1fr] md:gap-10 md:pl-14"
              >
                <span
                  className="timeline-dot absolute left-0 top-1.5 z-10 h-4 w-4 rounded-full border-2 border-[var(--surface-card)] bg-[var(--gold)] md:top-2"
                  aria-hidden
                />
                <p className="label-caps text-[var(--foreground)] md:pt-0.5">
                  {e.year}
                </p>
                <div>
                  <h3 className="font-display text-xl font-light md:text-2xl">
                    {e.title}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-[var(--secondary)] md:text-base">
                    {e.text}
                  </p>
                  {e.tag ? (
                    <span className="label-caps mt-4 inline-block border border-[var(--border)] bg-[var(--surface-card)] px-2 py-1 text-[var(--muted)]">
                      {e.tag}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
