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
      <section className="relative py-20 md:py-28 bg-cinema-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-3">
            Featured Campaign
          </p>
          <h2 className="text-display md:text-heading-lg font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white text-balance mb-8 max-w-3xl">
            {firstFeature.brand}
          </h2>

          {/* 16:9 cinematic player */}
          <div className="relative aspect-video rounded-sm overflow-hidden bg-smoke group">
            {/* Thumbnail */}
            {!playing && firstFeature.thumbnail && (
              <img
                src={firstFeature.thumbnail}
                alt={firstFeature.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${thumbLoaded ? "opacity-100" : "opacity-0"}`}
                loading="eager"
                onLoad={() => setThumbLoaded(true)}
              />
            )}

            {/* Gradient overlay */}
            {!playing && (
              <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/80 via-cinema-black/20 to-transparent" />
            )}

            {/* Info overlay */}
            {!playing && (
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-[10px] font-sans font-[500] text-champagne uppercase tracking-[0.15em] px-2 py-1 rounded bg-cinema-black/40 backdrop-blur-sm">
                    {getPlatformLabel(firstFeature.url)}
                  </span>
                  <span className="text-[10px] font-sans font-[400] text-cinema-white/50 uppercase tracking-[0.1em]">
                    {firstFeature.category}
                  </span>
                  <span className="text-[10px] font-sans font-[400] text-cinema-white/50 uppercase tracking-[0.1em]">
                    {firstFeature.year}
                  </span>
                </div>
                <h3 className="text-heading-sm md:text-heading font-display font-[400] text-cinema-white leading-[1.1]">
                  {firstFeature.title}
                </h3>
                <p className="text-body-sm font-sans font-[400] text-cinema-white/50 mt-1">
                  {firstFeature.role}
                </p>
              </div>
            )}

            {/* Play button */}
            {!playing && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-champagne/90 hover:bg-champagne transition-all duration-300 flex items-center justify-center cursor-pointer border-none group/btn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-1">
                  <path d="M8 5v14l11-7L8 5z" fill="#0B0B0B" />
                </svg>
              </button>
            )}

            {/* Embedded player */}
            {playing && embedUrl && (
              <iframe
                src={embedUrl}
                title={firstFeature.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* Watch full button */}
            {!playing && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-cinema-black/60 backdrop-blur-sm text-cinema-white text-caption font-sans font-[500] uppercase tracking-[0.15em] rounded border border-white/10 hover:bg-cinema-black/80 transition-all duration-300 cursor-pointer"
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
