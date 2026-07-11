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
    const el = scrollRef.current; if (!el) return;
    el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.6 : el.clientWidth * 0.6, behavior: "smooth" });
  };

  return (
    <>
      <section className="py-20 md:py-28 bg-cinema-black border-t border-cinema-white/8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 md:px-10 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-3">Production Library</p>
              <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em]">All Campaigns</h2>
            </div>
            <div className="hidden md:flex gap-3">
              <button onClick={() => scroll("left")} className="w-10 h-10 flex items-center justify-center text-stone hover:text-cinema-white transition-colors cursor-pointer bg-transparent border-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button onClick={() => scroll("right")} className="w-10 h-10 flex items-center justify-center text-stone hover:text-cinema-white transition-colors cursor-pointer bg-transparent border-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto px-8 md:px-10 pb-4 scrollbar-none snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {campaigns.map((c) => {
            const thumb = c.thumbnail || getYouTubeThumbnail(c.url) || "";
            return (
              <button key={c.id} onClick={() => setVideo({ url: c.url, title: c.title })} className="flex-shrink-0 w-[280px] md:w-[340px] lg:w-[380px] snap-start text-left group bg-transparent border-none cursor-pointer p-0">
                <div className="relative aspect-video overflow-hidden bg-cinema-white/8">
                  {thumb ? <img src={thumb} alt={c.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" loading="lazy" />
                    : <div className="w-full h-full bg-cinema-white/8 flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-stone"><rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" /><circle cx="9.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.2" /><path d="M2 17l5-5 3 3 4-4 6 6" stroke="currentColor" strokeWidth="1.2" /></svg></div>}
                  <div className="absolute inset-0 bg-cinema-black/0 group-hover:bg-cinema-black/40 transition-all duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-smoke/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-0.5"><path d="M8 5v14l11-7L8 5z" fill="#F5F5F2" /></svg>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 text-caption font-switzer font-[400] uppercase tracking-[0.02em] bg-smoke/80 text-stone">{getPlatformLabel(c.url)}</div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 text-caption font-switzer font-[400] uppercase tracking-[0.02em] bg-smoke/80 text-stone">{c.type === "youtube" ? "0:30–2:00" : "0:15–1:00"}</div>
                </div>
                <div className="mt-3">
                  <span className="text-caption font-switzer font-[500] text-stone uppercase tracking-[0.02em]">{c.category}</span>
                  <h3 className="text-body font-switzer font-[300] text-cinema-white leading-[1.2] group-hover:text-stone transition-colors duration-500 mt-0.5">{c.brand}</h3>
                  <p className="text-caption font-switzer font-[400] text-stone">{c.role} · {c.year}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {video && <VideoModal url={video.url} title={video.title} onClose={() => setVideo(null)} />}
    </>
  );
}
