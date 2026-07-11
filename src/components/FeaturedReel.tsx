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
      <section className="relative py-20 md:py-28 bg-cream-paper border-t border-charcoal/10">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8">
          <p className="font-geist font-[500] text-charcoal/50 uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
            Featured Campaign
          </p>
          <h2 className="font-gelica font-[500] text-cocoa-ink leading-[1.08] mb-8 max-w-3xl lowercase"
            style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
            {firstFeature.brand}
          </h2>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-dew-drop group">
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
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent" />
            )}

            {!playing && (
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-geist font-[500] text-cream-paper uppercase px-2 py-1 rounded bg-cream-paper/20 backdrop-blur-sm" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                    {getPlatformLabel(firstFeature.url)}
                  </span>
                  <span className="font-geist font-[400] text-cream-paper/50 uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
                    {firstFeature.category}
                  </span>
                  <span className="font-geist font-[400] text-cream-paper/50 uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
                    {firstFeature.year}
                  </span>
                </div>
                <h3 className="font-gelica font-[400] text-cream-paper leading-[1.1]" style={{ fontSize: "clamp(20px, 2.2vw, 28px)" }}>
                  {firstFeature.title}
                </h3>
                <p className="font-geist font-[400] text-cream-paper/50 mt-1" style={{ fontSize: "13px" }}>
                  {firstFeature.role}
                </p>
              </div>
            )}

            {!playing && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-cream-paper/90 hover:bg-cream-paper transition-all duration-300 flex items-center justify-center cursor-pointer border border-charcoal/20 group/btn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="ml-1">
                  <path d="M8 5v14l11-7L8 5z" fill="#171717" />
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
                className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-cream-paper/80 backdrop-blur-sm text-charcoal font-geist font-[500] uppercase rounded-xl border border-charcoal/10 hover:bg-cream-paper transition-all duration-300 cursor-pointer"
                style={{ fontSize: "10px", letterSpacing: "0.15em" }}
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
