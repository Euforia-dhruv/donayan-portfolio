"use client";

import { useEffect, useCallback } from "react";

interface VideoLightboxProps {
  url: string;
  type: "youtube" | "instagram";
  title: string;
  onClose: () => void;
}

function getYouTubeEmbed(url: string): string {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`;
  }
  return url;
}

export default function VideoLightbox({ url, type, title, onClose }: VideoLightboxProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const embedUrl = type === "youtube" ? getYouTubeEmbed(url) : url;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4 md:mx-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-cream-paper/60 hover:text-cream-paper font-geist uppercase bg-transparent border-none cursor-pointer transition-colors"
          style={{ fontSize: "13px", letterSpacing: "0.15em" }}
        >
          Close [ESC]
        </button>

        <div className="aspect-video bg-dew-drop rounded-xl overflow-hidden border border-charcoal/10">
          {type === "youtube" ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col gap-4 bg-dew-drop">
              <p className="font-geist font-[300] text-charcoal/60" style={{ fontSize: "16px" }}>
                Instagram content
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-charcoal/30 text-charcoal/70 font-geist font-[500] uppercase no-underline rounded-xl hover:border-charcoal/60 hover:text-charcoal transition-colors"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
              >
                Open in Instagram
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 9l6-6M9 3H5M9 3v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}
        </div>

        <p className="mt-4 font-geist font-[400] text-charcoal/60" style={{ fontSize: "14px" }}>
          {title}
        </p>
      </div>
    </div>
  );
}
