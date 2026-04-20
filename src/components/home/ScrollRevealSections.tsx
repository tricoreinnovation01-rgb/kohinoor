"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollRevealSections() {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        a.current,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: a.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );
      gsap.fromTo(
        b.current,
        { opacity: 0, y: 56 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: b.current,
            start: "top 85%",
            end: "top 45%",
            scrub: 1,
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 md:py-32">
      <div className="container-narrow grid gap-20 md:grid-cols-2">
        <div ref={a}>
          <p className="text-xs font-medium tracking-[0.25em] uppercase text-[var(--muted)]">
            Studio
          </p>
          <h3 className="mt-4 text-2xl font-light md:text-3xl">
            Crafted with restraint — each piece invites the eye to rest, then
            discover.
          </h3>
        </div>
        <div ref={b} className="flex flex-col justify-end">
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Materials, negative space, and light are treated as equal voices.
            Works span traditional media and digital exploration, unified by a
            calm, gallery-grade presentation.
          </p>
        </div>
      </div>
    </section>
  );
}
