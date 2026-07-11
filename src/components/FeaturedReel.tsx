"use client";

import { useState } from "react";
import archive from "@/data/archive.json";
import VideoModal from "@/components/VideoModal";
import { getYouTubeEmbedUrl, getYouTubeThumbnail, getPlatformLabel } from "@/lib/video-utils";

const featured = archive.filter((a) => a.featured && a.url);
const firstFeature = featured[0];

export default function FeaturedReel() {
  const [playing, setPlaying] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  if (!firstFeature) return null;

  const embedUrl = getYouTubeEmbedUrl(firstFeature.url, true);

  return (
    <>
      <section className="relative py-20 md:py-28 bg-bone-white border-t border-ash/50">
        <div className="max-w-[1400px] mx-auto px-8 md:px-10">
          <p className="text-caption font-switzer font-[400] text-graphite uppercase tracking-[0.02em] mb-3">
            Featured Campaign
          </p>
          <h2 className="text-heading md:text-display font-switzer font-[300] text-ink-black leading-[1] tracking-[-0.04em] mb-8 max-w-3xl">
            {firstFeature.brand}
          </h2>

          <div className="relative aspect-video overflow-hidden bg-bone-white group border border-ash/30">
            {!playing && firstFeature.thumbnail && (
              <img
                src={firstFeature.thumbnail}
                alt={firstFeature.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${thumbLoaded ? "opacity-100" : "opacity-0"}`}
                loading="eager"
                onLoad={() => setThumbLoaded(true)}
              />
            )}

            {!playing && (
              <div className="absolute inset-0 bg-gradient-to-t from-ink-black/40 to-transparent" />
            )}

            {!playing && (
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-caption font-switzer font-[400] text-graphite uppercase tracking-[0.02em] px-2 py-1 bg-bone-white/80">
                    {getPlatformLabel(firstFeature.url)}
                  </span>
                  <span className="text-caption font-switzer font-[400] text-bone-white/70 uppercase tracking-[0.02em]">
                    {firstFeature.category}
                  </span>
                  <span className="text-caption font-switzer font-[400] text-bone-white/70 uppercase tracking-[0.02em]">
                    {firstFeature.year}
                  </span>
                </div>
                <h3 className="text-heading-sm font-switzer font-[300] text-bone-white leading-[1] tracking-[-0.02em]">
                  {firstFeature.title}
                </h3>
                <p className="text-body-sm font-switzer font-[400] text-bone-white/60 mt-1">
                  {firstFeature.role}
                </p>
              </div>
            )}

            {!playing && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-bone-white/90 hover:bg-bone-white transition-all duration-300 flex items-center justify-center cursor-pointer border-none"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-1">
                  <path d="M8 5v14l11-7L8 5z" fill="#000000" />
                </svg>
              </button>
            )}

            {playing && embedUrl && (
              <iframe
                src={embedUrl}
                title={firstFeature.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {!playing && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-ink-black/80 text-bone-white text-caption font-switzer font-[400] uppercase tracking-[0.02em] hover:bg-ink-black transition-all duration-300 cursor-pointer border-none"
                style={{ borderRadius: "1440px" }}
              >
                Watch Full Campaign
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {playing && (
        <VideoModal
          url={firstFeature.url}
          title={firstFeature.title}
          onClose={() => setPlaying(false)}
        />
      )}
    </>
  );
}
