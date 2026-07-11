"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import archive from "@/data/archive.json";
import VideoLightbox from "./VideoLightbox";

const CATEGORIES = ["All", "Commercials", "Celebrity Campaigns", "Fashion", "Social Content", "Music Videos", "Brand Films"];

export default function ProductionArchive() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<{ url: string; type: "youtube" | "instagram"; title: string } | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return archive;
    return archive.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const openLightbox = (item: typeof archive[0]) => {
    setLightbox({ url: item.url, type: item.type as "youtube" | "instagram", title: `${item.brand} — ${item.title}` });
  };

  return (
    <>
      <section
        id="productions"
        ref={sectionRef}
        className="py-20 md:py-28 bg-cinema-black reveal"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="mb-10 md:mb-14">
            <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-4">
              Archive
            </p>
            <h2 className="text-display md:text-hero font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white text-balance">
              Production Archive
            </h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex-shrink-0 px-4 py-2 text-caption font-sans font-[500] uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer rounded ${
                  activeFilter === cat
                    ? "bg-champagne text-cinema-black"
                    : "bg-transparent text-cinema-white/50 border border-white/10 hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-5 space-y-4 md:space-y-5">
            {filtered.map((item, i) => {
              const isLandscape = item.type === "youtube";
              const hasThumb = item.type === "youtube" && item.thumbnail;

              return (
                <div
                  key={item.id}
                  className="group break-inside-avoid bg-smoke/30 border border-white/5 rounded overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-500"
                  onClick={() => openLightbox(item)}
                  style={{
                    opacity: 0,
                    animation: `fadeInUp 0.5s ease ${i * 0.04}s forwards`,
                  }}
                >
                  <div
                    className={`relative overflow-hidden ${isLandscape ? "aspect-video" : "aspect-[4/5]"}`}
                  >
                    {hasThumb ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-charcoal to-smoke flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="w-10 h-10 mx-auto mb-3 rounded-full border border-white/10 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-cinema-white/30">
                              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1" />
                              <path d="M6 5l5 3-5 3V5z" fill="currentColor" />
                            </svg>
                          </div>
                          <p className="text-caption font-sans font-[400] text-cinema-white/30 uppercase tracking-[0.1em]">
                            {item.brand}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                      <span className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.15em] flex items-center gap-2">
                        Watch Campaign →
                      </span>
                    </div>

                    {item.featured && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 bg-champagne text-cinema-black text-caption font-sans font-[500] uppercase tracking-[0.1em] rounded text-[10px]">
                          Featured
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 z-10">
                      <span className={`px-2 py-0.5 text-caption font-sans font-[500] uppercase tracking-[0.1em] rounded text-[10px] ${
                        item.type === "youtube"
                          ? "bg-red-600/80 text-white"
                          : "bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white"
                      }`}>
                        {item.type === "youtube" ? "YouTube" : "Instagram"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-heading-sm font-display font-[400] text-cinema-white leading-[1.3] tracking-[-0.01em]">
                      {item.brand}
                    </h3>
                    <p className="mt-1 text-body-sm font-sans font-[400] text-cinema-white/50 leading-[1] tracking-[0.02em]">
                      {item.title} &middot; {item.year}
                    </p>
                    <p className="mt-1 text-caption font-sans font-[400] text-cinema-white/30 uppercase tracking-[0.1em]">
                      {item.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-body font-sans font-[300] text-cinema-white/40">
                No productions match this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <VideoLightbox
          url={lightbox.url}
          type={lightbox.type}
          title={lightbox.title}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
