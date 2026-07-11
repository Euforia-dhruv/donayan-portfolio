"use client";

import { useEffect, useCallback, useState } from "react";
import { getYouTubeEmbedUrl, isEmbeddable, getPlatformLabel } from "@/lib/video-utils";

interface VideoModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function VideoModal({ url, title, onClose }: VideoModalProps) {
  const [loaded, setLoaded] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      clearTimeout(timer);
    };
  }, [handleKey]);

  const embeddable = isEmbeddable(url);
  const embedUrl = embeddable ? getYouTubeEmbedUrl(url, true) : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cinema-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-cinema-white/60 hover:text-cinema-white text-body-sm font-sans uppercase tracking-[0.15em] bg-transparent border-none cursor-pointer transition-colors z-10"
        >
          Close [ESC]
        </button>

        {/* Title */}
        <p className="text-body-sm font-sans font-[400] text-cinema-white/50 mb-3 tracking-[0.02em] truncate pr-20">
          {title}
        </p>

        {/* Player */}
        <div className="relative aspect-video bg-smoke rounded-sm overflow-hidden">
          {embeddable && embedUrl ? (
            <>
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-champagne/30 border-t-champagne rounded-full animate-spin" />
                </div>
              )}
              <iframe
                src={embedUrl}
                title={title}
                className={`w-full h-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-charcoal to-smoke">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-stone/40">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.2" />
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <p className="text-body font-sans font-[400] text-cinema-white/40">
                Preview not available — open on {getPlatformLabel(url)}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-champagne text-cinema-black text-body-sm font-sans font-[500] uppercase tracking-[0.15em] rounded hover:bg-champagne/90 transition-all duration-300 no-underline"
              >
                Open on {getPlatformLabel(url)}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
