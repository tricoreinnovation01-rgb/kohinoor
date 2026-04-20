"use client";

import Image from "next/image";
import Link from "next/link";
import { formatNprFromUsd } from "@/lib/currency";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export type HeroFeatured = {
  slug: string;
  title: string;
  imageUrl: string;
  category: string;
  price: number;
};

export function HeroSection({ featured }: { featured?: HeroFeatured | null }) {
  const root = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const line1 = useRef<HTMLHeadingElement>(null);
  const line2 = useRef<HTMLParagraphElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        eyebrow.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0
      )
        .fromTo(
          line1.current,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.1 },
          0.12
        )
        .fromTo(
          line2.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85 },
          0.35
        )
        .fromTo(
          actions.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.55
        )
        .fromTo(
          visual.current,
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          0.25
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[min(100svh,920px)] items-center overflow-hidden pb-20 pt-28 md:pb-28 md:pt-32"
    >
      <div
        className="pointer-events-none absolute -right-[20%] top-0 h-[70%] w-[55%] rounded-full opacity-[0.06] blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gold) 80%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="container-narrow relative grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
        <div className="max-w-xl lg:max-w-none">
          <p
            ref={eyebrow}
            className="label-caps text-[var(--gold-deep)]"
          >
            Kohinoor Artist · Kathmandu
          </p>
          <h1
            ref={line1}
            className="font-display mt-8 text-[2.5rem] font-light leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem]"
          >
            Capturing the Essence of{" "}
            <em className="not-italic font-light italic text-[var(--gold-deep)]">
              Unspoken Atmospheres
            </em>
            .
          </h1>
          <p
            ref={line2}
            className="mt-8 max-w-md text-base font-light leading-relaxed text-[var(--secondary)] md:text-lg"
          >
            A quiet gallery for drawings and studies — where paper, light, and
            patience meet. Explore the archive or acquire an original from the
            shop.
          </p>
          <div
            ref={actions}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/portfolio"
              className="inline-flex min-h-11 items-center justify-center border border-[var(--foreground)] bg-[var(--foreground)] px-8 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--background)] transition hover:opacity-90"
            >
              View works
            </Link>
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center justify-center border border-[var(--border)] bg-[var(--surface-card)] px-8 py-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:border-[var(--gold)] hover:text-[var(--gold-deep)]"
            >
              Shop
            </Link>
          </div>
        </div>

        <div ref={visual} className="relative lg:justify-self-end">
          {featured ? (
            <Link
              href={`/work/${featured.slug}`}
              className="group relative mx-auto block max-w-md lg:mr-0 lg:max-w-none"
            >
              <div className="relative aspect-[3/4] overflow-hidden border border-[var(--border)] bg-[var(--surface-card)]">
                <span className="absolute left-4 top-4 z-20 border border-[var(--border)] bg-[var(--surface-card)]/95 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--gold-deep)] backdrop-blur-sm">
                  Featured
                </span>
                <Image
                  src={featured.imageUrl}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover transition duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.02]"
                  sizes="(max-width:1024px) 90vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/65 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white">
                  <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/70">
                    {featured.category}
                  </p>
                  <p className="font-display mt-2 text-2xl font-light leading-tight md:text-3xl">
                    {featured.title}
                  </p>
                  <p className="mt-3 font-display text-lg font-light text-white/95">
                    {formatNprFromUsd(featured.price)}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-card)] to-[color-mix(in_oklab,var(--gold)_10%,var(--surface))] lg:max-w-none" />
          )}
        </div>
      </div>
    </section>
  );
}
