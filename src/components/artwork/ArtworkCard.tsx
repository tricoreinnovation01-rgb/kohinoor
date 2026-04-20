"use client";

import Image from "next/image";
import Link from "next/link";
import { formatNprFromUsd } from "@/lib/currency";

export type ArtworkCardProps = {
  title: string;
  imageUrl: string;
  price: number;
  category: string;
  onOpen?: () => void;
  href?: string;
  aspectClassName?: string;
};

export function ArtworkCard({
  title,
  imageUrl,
  price,
  category,
  onOpen,
  href,
  aspectClassName = "aspect-[3/4]",
}: ArtworkCardProps) {
  const inner = (
    <div className="transition duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1">
      <div
        className={`group relative ${aspectClassName} overflow-hidden border border-[var(--border)] bg-[var(--surface)]`}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#0d0d0d]/0 transition duration-500 group-hover:bg-[#0d0d0d]/60" />
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/80">
            {category}
          </p>
          <p className="font-display mt-1 text-lg font-light">{title}</p>
          <p className="mt-1 text-sm font-light text-white/95">
            {formatNprFromUsd(price)}
          </p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full text-left">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" className="block w-full text-left" onClick={onOpen}>
      {inner}
    </button>
  );
}
