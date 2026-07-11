"use client";

import { useRef, useEffect, useState } from "react";
import archive from "@/data/archive.json";
import VideoModal from "@/components/VideoModal";
import { getYouTubeThumbnail, getPlatformLabel } from "@/lib/video-utils";

const categories = [
  "All",
  "Featured Campaigns",
  "Commercial Films",
  "Fashion Campaigns",
  "Celebrity Campaigns",
  "Brand Films",
  "Digital & Social Content",
  "Music Videos",
  "Behind the Scenes",
];

export default function FeaturedProductions() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCat, setActiveCat] = useState("All");
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = activeCat === "All"
    ? archive
    : archive.filter((p) => p.category === activeCat);

  const handleClick = (p: (typeof archive)[0]) => {
    if (p.url) {
      setVideo({ url: p.url, title: p.title });
    } else if (p.documents?.[0]?.path) {
      window.open(p.documents[0].path, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <section
        id="featured"
        ref={sectionRef}
        className="relative py-24 md:py-32 overflow-hidden reveal"
        style={{ background: "#0B0B0B" }}
      >
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-3 reveal reveal-delay-1">
            Production Archive
          </p>
          <h2 className="text-display md:text-heading-lg font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white max-w-2xl mb-10 reveal reveal-delay-2">
            All Productions
          </h2>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-12 reveal reveal-delay-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`text-caption font-sans font-[500] uppercase tracking-[0.15em] px-4 py-2 rounded transition-all duration-300 cursor-pointer ${
                  activeCat === cat
                    ? "bg-champagne text-cinema-black"
                    : "bg-transparent text-cinema-white/50 border border-white/10 hover:border-white/30 hover:text-cinema-white/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Netflix-style grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((p, i) => {
              const thumb = p.thumbnail || getYouTubeThumbnail(p.url) || "";
              const hasVideo = !!p.url;
              const hasDoc = !!p.documents?.[0]?.path;
              return (
                <div
                  key={p.id}
                  onClick={() => handleClick(p)}
                  className={`group cursor-pointer reveal reveal-delay-${Math.min(i + 1, 5)}`}
                >
                  {/* Cinematic card */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-smoke">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={p.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-charcoal to-smoke">
                        <div className="text-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto text-stone/40 mb-2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p className="text-caption text-stone/40 font-sans uppercase tracking-[0.1em]">{p.brand}</p>
                        </div>
                      </div>
                    )}

                    {/* Glassmorphism overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/90 via-cinema-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-sans font-[500] text-champagne uppercase tracking-[0.15em]">
                            {p.category}
                          </span>
                          {p.year && (
                            <span className="text-[9px] font-sans font-[400] text-cinema-white/50 uppercase tracking-[0.1em]">
                              {p.year}
                            </span>
                          )}
                        </div>
                        <h3 className="text-body-sm md:text-lead font-display font-[400] text-cinema-white leading-[1.1]">
                          {p.brand}
                        </h3>
                        <p className="text-caption font-sans font-[400] text-cinema-white/50 mt-1">
                          {p.role}
                        </p>
                        {p.description && (
                          <p className="text-caption font-sans font-[300] text-cinema-white/40 mt-1 line-clamp-2">
                            {p.description}
                          </p>
                        )}
                        <div className="flex gap-3 mt-3">
                          {hasVideo && (
                            <span className="text-[10px] font-sans font-[500] text-champagne uppercase tracking-[0.15em] inline-flex items-center gap-1">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                              </svg>
                              Watch Campaign
                            </span>
                          )}
                          {hasDoc && (
                            <span className="text-[10px] font-sans font-[400] text-cinema-white/50 uppercase tracking-[0.1em] inline-flex items-center gap-1">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.2"/>
                              </svg>
                              View Case Study
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Always-visible badges */}
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {p.featured && (
                        <span className="px-2 py-1 text-[8px] font-sans font-[500] uppercase tracking-[0.15em] rounded bg-champagne/20 text-champagne backdrop-blur-sm">
                          Featured
                        </span>
                      )}
                      {p.url && (
                        <span className="px-2 py-1 text-[8px] font-sans font-[500] uppercase tracking-[0.15em] rounded bg-cinema-black/60 text-cinema-white/70 backdrop-blur-sm">
                          {getPlatformLabel(p.url)}
                        </span>
                      )}
                      {!p.url && (
                        <span className="px-2 py-1 text-[8px] font-sans font-[500] uppercase tracking-[0.15em] rounded bg-cinema-black/60 text-champagne/70 backdrop-blur-sm">
                          Document
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Always-visible info below card */}
                  <div className="mt-4">
                    <h3 className="text-body-sm md:text-body font-display font-[400] text-cinema-white leading-[1.2] group-hover:text-champagne transition-colors duration-500">
                      {p.brand}
                    </h3>
                    <p className="text-caption font-sans font-[400] text-stone mt-0.5">
                      {p.role} · {p.year}
                    </p>
                  </div>
                </div>
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
