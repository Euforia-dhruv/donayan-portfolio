"use client";

import { useState, useRef } from "react";
import archive from "@/data/archive.json";
import VideoModal from "@/components/VideoModal";
import { getYouTubeThumbnail, getPlatformLabel } from "@/lib/video-utils";

const campaigns = archive.filter((a) => a.url);

export default function CampaignCarousel() {
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <>
      <section className="py-20 md:py-28 bg-cream-paper border-t border-charcoal/10 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-geist font-[500] text-charcoal/50 uppercase" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
                Production Library
              </p>
              <h2 className="font-gelica font-[500] text-cocoa-ink leading-[1.08] mt-2 lowercase"
                style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
                all campaigns
              </h2>
            </div>
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal/40 hover:text-charcoal hover:border-charcoal/40 transition-all duration-300 cursor-pointer bg-transparent"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-charcoal/20 flex items-center justify-center text-charcoal/40 hover:text-charcoal hover:border-charcoal/40 transition-all duration-300 cursor-pointer bg-transparent"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto px-6 md:px-8 pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {campaigns.map((c) => {
            const thumb = c.thumbnail || getYouTubeThumbnail(c.url) || "";
            return (
              <button
                key={c.id}
                onClick={() => setVideo({ url: c.url, title: c.title })}
                className="flex-shrink-0 w-[280px] md:w-[340px] lg:w-[380px] snap-start text-left group bg-transparent border-none cursor-pointer p-0"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-dew-drop">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={c.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-dew-drop flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-charcoal/30">
                        <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="9.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M2 17l5-5 3 3 4-4 6 6" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-cream-paper/0 group-hover:bg-charcoal/30 transition-all duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-cream-paper/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100 border border-charcoal/20">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                        <path d="M8 5v14l11-7L8 5z" fill="#171717" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-1 font-geist font-[500] uppercase rounded bg-cream-paper/80 text-charcoal/70 backdrop-blur-sm" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
                    {getPlatformLabel(c.url)}
                  </div>

                  <div className="absolute bottom-3 left-3 px-2 py-0.5 font-geist font-[400] uppercase rounded bg-cream-paper/80 text-charcoal/50 backdrop-blur-sm" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>
                    {c.type === "youtube" ? "0:30–2:00" : "0:15–1:00"}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="font-geist font-[500] text-cocoa-ink uppercase" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                    {c.category}
                  </span>
                  <h3 className="font-gelica font-[400] text-charcoal leading-[1.2] group-hover:text-cocoa-ink transition-colors duration-500 mt-0.5" style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}>
                    {c.brand}
                  </h3>
                  <p className="font-geist font-[400] text-charcoal/50 mt-0.5" style={{ fontSize: "13px" }}>
                    {c.role} · {c.year}
                  </p>
                </div>
              </button>
            );
          })}
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
