"use client";

import { useState } from "react";
import archive from "@/data/archive.json";
import VideoModal from "@/components/VideoModal";
import { getYouTubeThumbnail, getPlatformLabel } from "@/lib/video-utils";

const reels = archive.filter(
  (a) => a.url && (a.url.includes("instagram.com") || a.url.includes("shorts"))
);

export default function ReelGallery() {
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null);

  if (reels.length === 0) return null;

  return (
    <>
      <section className="py-20 md:py-28 bg-cinema-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-10">
          <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-3">
            Social & Digital
          </p>
          <h2 className="text-display md:text-heading-lg font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white text-balance">
            Reels & Short-Form Content
          </h2>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {reels.map((r, i) => {
              const isReel = r.url.includes("instagram.com/reel") || r.url.includes("shorts");
              const thumb = r.thumbnail || getYouTubeThumbnail(r.url) || "";
              return (
                <button
                  key={r.id}
                  onClick={() => setVideo({ url: r.url, title: r.title })}
                  className={`w-full group bg-transparent border-none cursor-pointer p-0 text-left break-inside-avoid ${
                    isReel ? "aspect-[9/16]" : "aspect-video"
                  }`}
                >
                  <div
                    className={`relative w-full overflow-hidden rounded-sm bg-smoke ${
                      isReel ? "aspect-[9/16]" : "aspect-video"
                    }`}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={r.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-charcoal to-smoke flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-stone/40">
                          <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" />
                          <circle cx="9.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M2 17l5-5 3 3 4-4 6 6" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-cinema-black/0 group-hover:bg-cinema-black/50 transition-all duration-500 flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-champagne/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                          <path d="M8 5v14l11-7L8 5z" fill="#0B0B0B" />
                        </svg>
                      </div>
                      <span className="text-caption font-sans font-[500] text-cinema-white uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        View {isReel ? "Reel" : "Campaign"} →
                      </span>
                    </div>

                    {/* Platform badge */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 text-[7px] font-sans font-[500] uppercase tracking-[0.15em] rounded bg-cinema-black/60 text-cinema-white/70 backdrop-blur-sm">
                      {getPlatformLabel(r.url)}
                    </div>
                  </div>

                  <div className="mt-2 px-0.5">
                    <h3 className="text-body-sm font-sans font-[400] text-cinema-white leading-[1.2] group-hover:text-champagne transition-colors duration-500">
                      {r.brand}
                    </h3>
                    <p className="text-caption font-sans font-[400] text-stone">
                      {r.role} · {r.year}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {video && (
        <VideoModal
          url={video.url}
          title={video.title}
          onClose={() => setVideo(null)}
        />
      )}
    </>
  );
}
