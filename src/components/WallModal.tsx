"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { WallItem } from "@/types/wall";

const isVideoUrl = (u?: string) =>
  !!u && /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(u);

function platformOf(source: string): "youtube" | "instagram" | "website" {
  if (/instagram\.com/.test(source)) return "instagram";
  if (/youtube\.com|youtu\.be/.test(source)) return "youtube";
  return "website";
}

const PLATFORM_LABEL: Record<string, string> = {
  youtube: "Watch on YouTube",
  instagram: "View on Instagram",
  website: "Visit Website",
};

/**
 * Project detail modal for the Production Wall.
 *
 * Only here — never on the wall — do we surface title, client, description and
 * the external source links. The wall itself stays image-first and text-free.
 * The card opens this modal; the buttons inside are the only things that ever
 * navigate to the ORIGINAL source (Instagram / YouTube / Website), never the
 * local asset.
 */
export default function WallModal({
  item,
  onClose,
}: {
  item: WallItem;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const media =
    item.gallery && item.gallery.length > 0 ? item.gallery : [item.cover];
  const total = media.length;
  const current = media[idx];
  const isVid = isVideoUrl(current);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIdx((i) => Math.min(total - 1, i + 1));
      else if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, total]);

  const platform = platformOf(item.source);
  const label = PLATFORM_LABEL[platform];
  const client = item.brand && item.brand !== item.title ? item.brand : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-cinema-white transition-colors hover:bg-white/15"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className="relative flex max-h-[90vh] w-full max-w-[1200px] flex-col gap-6 overflow-hidden md:flex-row md:items-stretch"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media viewer — never crops the artwork in the modal. */}
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-charcoal"
          style={{ minHeight: "50vh" }}
        >
          {isVid ? (
            <video
              src={current}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="max-h-[80vh] w-full bg-black object-contain"
            />
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={current}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 95vw, 760px"
                className="object-contain"
                priority
              />
            </div>
          )}

          {total > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                aria-label="Previous"
                className="font-switzer text-caption text-cinema-white transition-opacity disabled:opacity-30"
              >
                ←
              </button>
              <span className="font-switzer text-caption text-cinema-white/80">
                {idx + 1} / {total}
              </span>
              <button
                type="button"
                onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
                disabled={idx === total - 1}
                aria-label="Next"
                className="font-switzer text-caption text-cinema-white transition-opacity disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Details — the only place metadata is shown. */}
        <div className="flex w-full shrink-0 flex-col md:w-[360px]">
          {client && (
            <p className="font-switzer text-caption font-[400] uppercase tracking-[0.14em] text-gold/70">
              {client}
            </p>
          )}
          <h2
            className="mt-2 font-switzer font-[300] leading-[1.08] tracking-[-0.02em] text-cinema-white"
            style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}
          >
            {item.title}
          </h2>

          {item.description && (
            <p className="mt-4 font-switzer text-body-sm font-[300] leading-relaxed text-cinema-white/65">
              {item.description}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <a
              href={item.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-switzer text-caption font-[500] uppercase tracking-[0.08em] text-cinema-black transition-colors hover:bg-gold/85"
            >
              {label}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href={item.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center font-switzer text-caption font-[400] uppercase tracking-[0.08em] text-stone transition-colors hover:text-cinema-white"
            >
              Open original source ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
