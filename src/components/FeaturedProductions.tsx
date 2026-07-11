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
        className="relative py-24 md:py-32 overflow-hidden reveal bg-cream-paper"
      >
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8">
          <p className="font-geist font-[500] text-charcoal/50 uppercase mb-3 reveal reveal-delay-1" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
            Production Archive
          </p>
          <h2 className="font-gelica font-[500] text-cocoa-ink leading-[1.08] max-w-2xl mb-10 reveal reveal-delay-2 lowercase"
            style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
            all productions
          </h2>

          <div className="flex flex-wrap gap-2 mb-12 reveal reveal-delay-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`font-geist font-[500] uppercase px-4 py-2 transition-all duration-300 cursor-pointer rounded-xl ${
                  activeCat === cat
                    ? "bg-charcoal text-cream-paper"
                    : "bg-transparent text-charcoal/50 border border-charcoal/20 hover:border-charcoal/40 hover:text-charcoal"
                }`}
                style={{ fontSize: "10px", letterSpacing: "0.15em" }}
              >
                {cat}
              </button>
            ))}
          </div>

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
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-dew-drop">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={p.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-dew-drop">
                        <div className="text-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto text-charcoal/30 mb-2">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p className="font-geist font-[400] text-charcoal/30 uppercase" style={{ fontSize: "12px", letterSpacing: "0.1em" }}>{p.brand}</p>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-geist font-[500] text-cream-paper uppercase" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                            {p.category}
                          </span>
                          {p.year && (
                            <span className="font-geist font-[400] text-cream-paper/50 uppercase" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>
                              {p.year}
                            </span>
                          )}
                        </div>
                        <h3 className="font-gelica font-[400] text-cream-paper leading-[1.1]" style={{ fontSize: "clamp(14px, 1.3vw, 18px)" }}>
                          {p.brand}
                        </h3>
                        <p className="font-geist font-[400] text-cream-paper/50 mt-1" style={{ fontSize: "12px" }}>
                          {p.role}
                        </p>
                        {p.description && (
                          <p className="font-geist font-[300] text-cream-paper/40 mt-1 line-clamp-2" style={{ fontSize: "12px" }}>
                            {p.description}
                          </p>
                        )}
                        <div className="flex gap-3 mt-3">
                          {hasVideo && (
                            <span className="font-geist font-[500] text-cream-paper uppercase inline-flex items-center gap-1" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                              </svg>
                              Watch Campaign
                            </span>
                          )}
                          {hasDoc && (
                            <span className="font-geist font-[400] text-cream-paper/50 uppercase inline-flex items-center gap-1" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.2"/>
                              </svg>
                              View Case Study
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {p.featured && (
                        <span className="px-2 py-1 font-geist font-[500] uppercase rounded bg-cream-paper/80 text-charcoal backdrop-blur-sm" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
                          Featured
                        </span>
                      )}
                      {p.url && (
                        <span className="px-2 py-1 font-geist font-[500] uppercase rounded bg-cream-paper/80 text-charcoal/70 backdrop-blur-sm" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
                          {getPlatformLabel(p.url)}
                        </span>
                      )}
                      {!p.url && (
                        <span className="px-2 py-1 font-geist font-[500] uppercase rounded bg-cream-paper/80 text-charcoal/60 backdrop-blur-sm" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
                          Document
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-gelica font-[400] text-charcoal leading-[1.2] group-hover:text-cocoa-ink transition-colors duration-500" style={{ fontSize: "clamp(14px, 1.3vw, 17px)" }}>
                      {p.brand}
                    </h3>
                    <p className="font-geist font-[400] text-charcoal/50 mt-0.5" style={{ fontSize: "13px" }}>
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
