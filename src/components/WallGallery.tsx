"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { WallItem } from "@/types/wall";

/**
 * In-app gallery for GROUPED projects (e.g. 6.1–6.5 are one project).
 * Browse every image, then jump to the original source via "View Project →".
 */
export default function WallGallery({
  item,
  onClose,
}: {
  item: WallItem;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const total = item.gallery.length;

  const prev = useCallback(
    () => setIdx((i) => Math.max(0, i - 1)),
    [],
  );
  const next = useCallback(
    () => setIdx((i) => Math.min(total - 1, i + 1)),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, next, prev]);

  const url = item.gallery[idx];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — gallery`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-cinema-white transition-colors hover:bg-white/15"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className="relative flex h-full w-full max-w-[1100px] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex w-full items-start justify-between gap-4">
          <div className="min-w-0 max-w-[70ch]">
            <p className="font-switzer text-caption uppercase tracking-[0.12em] text-gold/75">
              {item.category}
              {item.year ? ` · ${item.year}` : ""}
              {item.platform ? ` · ${item.platform}` : ""}
            </p>
            <p className="font-switzer text-body-md font-[300] text-cinema-white">
              {item.title}
            </p>
            {item.description && (
              <p className="mt-2 font-switzer text-caption font-[300] leading-relaxed text-cinema-white/65">
                {item.description}
              </p>
            )}
          </div>
          <a
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 font-switzer text-caption uppercase tracking-[0.08em] text-gold transition-colors hover:bg-gold hover:text-cinema-black"
          >
            View Project →
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-2xl bg-charcoal">
          <Image
            src={url}
            alt={`${item.title} (${idx + 1} of ${total})`}
            fill
            sizes="(max-width: 1024px) 95vw, 1100px"
            className="object-contain"
            priority
          />
        </div>

        {total > 1 && (
          <>
            <div className="mt-3 flex items-center gap-4">
              <button
                onClick={prev}
                disabled={idx === 0}
                className="rounded-full border border-white/15 px-5 py-2 font-switzer text-caption uppercase tracking-[0.08em] text-cinema-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="font-switzer text-caption text-cinema-white/70">
                {idx + 1} / {total}
              </span>
              <button
                onClick={next}
                disabled={idx === total - 1}
                className="rounded-full border border-white/15 px-5 py-2 font-switzer text-caption uppercase tracking-[0.08em] text-cinema-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              {item.gallery.map((g, i) => (
                <button
                  key={g}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-2 w-2 rounded-full transition-colors ${i === idx ? "bg-gold" : "bg-white/30 hover:bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
