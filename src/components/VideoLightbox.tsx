"use client";

import { useEffect, useCallback } from "react";

interface VideoLightboxProps { url: string; type: "youtube" | "instagram"; title: string; onClose: () => void; }

function getYouTubeEmbed(url: string): string {
  const patterns = [/youtu\.be\/([^?&]+)/, /youtube\.com\/watch\?v=([^&]+)/, /youtube\.com\/embed\/([^?&]+)/, /youtube\.com\/shorts\/([^?&]+)/];
  for (const p of patterns) { const m = url.match(p); if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0`; }
  return url;
}

export default function VideoLightbox({ url, type, title, onClose }: VideoLightboxProps) {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);
  useEffect(() => { document.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden"; return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; }; }, [handleKey]);

  const embedUrl = type === "youtube" ? getYouTubeEmbed(url) : url;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-cinema-black/95 backdrop-blur-md" onClick={onClose}>
      <div className="relative w-full max-w-5xl mx-4 md:mx-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-cinema-white/60 hover:text-cinema-white text-caption font-switzer uppercase tracking-[0.02em] bg-transparent border-none cursor-pointer transition-colors">Close [ESC]</button>

        <div className="aspect-video bg-smoke overflow-hidden border border-cinema-white/6">
          {type === "youtube" ? (
            <iframe src={embedUrl} title={title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-col gap-4">
              <p className="text-body font-switzer font-[300] text-stone">Instagram content</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-cinema-black text-caption font-switzer font-[400] uppercase tracking-[0.02em] no-underline" style={{ borderRadius: "1440px" }}>Open in Instagram<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9l6-6M9 3H5M9 3v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
            </div>
          )}
        </div>

        <p className="mt-4 text-body-sm font-switzer font-[400] text-stone">{title}</p>
      </div>
    </div>
  );
}
