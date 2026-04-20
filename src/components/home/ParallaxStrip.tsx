"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ParallaxStrip() {
  const bg = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bg.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: bg.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-[45vh] min-h-[280px] overflow-hidden border-y border-[var(--border)]">
      <div
        ref={bg}
        className="absolute inset-0 scale-110 bg-[url('https://images.unsplash.com/photo-1549887534-1541e9326642?w=1920&q=80')] bg-cover bg-center opacity-40"
        aria-hidden
      />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <p className="max-w-lg text-sm font-light tracking-wide text-[var(--foreground)] md:text-base">
          “Art is the lie that enables us to realize the truth.” — Picasso
        </p>
      </div>
    </section>
  );
}
