"use client";

import { useEffect } from "react";
import AutoVideo from "@/components/AutoVideo";

export interface LightboxData {
  type: "video" | "image";
  src: string;
  source?: string;
  title?: string;
  platform?: string;
  description?: string;
  category?: string;
  year?: string;
  pdf?: string;
}

export default function Lightbox({
  data,
  onClose,
}: {
  data: LightboxData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!data) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [data, onClose]);

  if (!data) return null;

  // PDF: embedded viewer
  if (data.pdf) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={data.title || "Document preview"}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/92 backdrop-blur-sm p-4 sm:p-8"
        onClick={onClose}
      >
        <div
          className="relative flex h-full w-full max-w-[1000px] flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            {data.title && (
              <p className="font-switzer text-body-md font-[300] text-cinema-white">{data.title}</p>
            )}
            <a
              href={data.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 font-switzer text-caption uppercase tracking-[0.08em] text-gold transition-colors hover:bg-gold hover:text-cinema-black"
            >
              Open Original
            </a>
          </div>
          <iframe
            src={data.pdf}
            title={data.title || "Document"}
            className="h-[78vh] w-full rounded-2xl bg-white"
          />
        </div>
      </div>
    );
  }

  // Media (video / image)
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={data.title || "Media preview"}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm p-4 sm:p-8"
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
        className="relative flex max-h-full w-full max-w-[1100px] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full overflow-hidden rounded-2xl bg-charcoal shadow-2xl">
          {data.type === "video" ? (
            <div className="aspect-video w-full">
              <AutoVideo src={data.src} mode="autoplay" className="relative" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.src}
              alt={data.title || "Media"}
              className="max-h-[80vh] w-auto max-w-full mx-auto block"
            />
          )}
        </div>

        {(data.title || data.source) && (
          <div className="mt-4 flex w-full flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 max-w-[70ch]">
              {data.category && (
                <p className="font-switzer text-caption uppercase tracking-[0.12em] text-gold/70">
                  {data.category}
                  {data.year ? ` · ${data.year}` : ""}
                  {data.platform ? ` · ${data.platform}` : ""}
                </p>
              )}
              {data.title && (
                <p className="font-switzer text-body-md font-[300] text-cinema-white">
                  {data.title}
                </p>
              )}
              {data.description && (
                <p className="mt-2 font-switzer text-caption font-[300] leading-relaxed text-cinema-white/65">
                  {data.description}
                </p>
              )}
            </div>
            {data.source && (
              <a
                href={data.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 font-switzer text-caption uppercase tracking-[0.08em] text-gold transition-colors hover:bg-gold hover:text-cinema-black"
              >
                Open Original
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
