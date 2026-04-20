"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function AboutSilence({
  title = "The beauty of silence.",
  text = "",
  imageUrl = "https://images.unsplash.com/photo-1610701596007-115028617dc2?w=1200&q=80",
}: {
  title?: string;
  text?: string;
  imageUrl?: string;
}) {
  return (
    <section className="border-t border-[var(--border)] py-20 md:py-28">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="relative mx-auto aspect-[4/3] max-w-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <Image
              src={imageUrl}
              alt="Still life study"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 42rem"
            />
          </div>
          <p className="font-display mt-10 text-2xl font-light italic text-[var(--foreground)] md:text-3xl">
            {title}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm font-light text-[var(--secondary)]">
            {text}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
