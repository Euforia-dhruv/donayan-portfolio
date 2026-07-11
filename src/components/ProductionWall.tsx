"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import galleryCards from "@/data/gallery-cards.json";
import archiveData from "@/data/archive.json";
import VideoModal from "@/components/VideoModal";
import { getYouTubeThumbnail } from "@/lib/video-utils";

interface CardDim {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  z: number;
  doc?: string;
  brand: string;
  year: string;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const videoCardLabels = new Set([
  "FINAL CAMPAIGN", "DIRECTOR MONITOR", "BTS PHOTOGRAPHY",
  "CELEBRITY STILL", "FILM STILL", "DIRECTOR'S VIEW",
  "CREW MOMENT", "CAMERA SETUP", "LIGHTING SETUP",
]);

export default function ProductionWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null);

  const brandVideoMap = useMemo(() => {
    const m = new Map<string, { url: string; title: string }>();
    archiveData.forEach((a) => {
      if (a.url) {
        m.set(a.brand.toLowerCase(), { url: a.url, title: a.title });
      }
    });
    return m;
  }, []);

  const cards: CardDim[] = useMemo(() => {
    const taken: { x: number; y: number }[] = [];
    return galleryCards.map((c, i) => {
      let x: number, y: number, attempts = 0;
      do {
        x = rand(1, 72);
        y = rand(2, 62);
        attempts++;
      } while (attempts < 50 && taken.some((p) => Math.abs(p.x - x) < 9 && Math.abs(p.y - y) < 9));
      taken.push({ x, y });
      return {
        id: c.id, label: c.label, sub: c.sub, doc: c.doc,
        brand: c.brand, year: c.year, x, y, w: c.width, h: c.height,
        rotation: rand(-3, 3), z: 10 + i,
      };
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = (card: CardDim) => {
    if (card.doc) { window.open(card.doc, "_blank", "noopener,noreferrer"); return; }
    const info = brandVideoMap.get(card.brand.toLowerCase());
    if (info) setVideo(info);
  };

  return (
    <>
      <section id="wall" ref={sectionRef} className="relative min-h-screen py-24 md:py-32 overflow-hidden reveal"
        style={{ background: "linear-gradient(160deg, #0A0A0A 0%, #141414 40%, #1A1A1A 70%, #0A0A0A 100%)" }}
      >
        <div className="absolute inset-0 paper-bg pointer-events-none" />

        <div className="relative z-30 max-w-[1400px] mx-auto px-8 md:px-10 mb-16 md:mb-20">
          <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">Production Archive</p>
          <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">The Wall</h2>
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-8 md:px-10" style={{ minHeight: "70vh" }}>
          {cards.map((card) => {
            const info = brandVideoMap.get(card.brand.toLowerCase());
            const thumb = info ? getYouTubeThumbnail(info.url) : null;
            const isVideo = videoCardLabels.has(card.label) && !!info;

            return (
              <div key={card.id} onClick={() => handleCardClick(card)}
                className="absolute group cursor-pointer"
                style={{
                  width: `${card.w}px`, height: `${card.h}px`, zIndex: card.z,
                  left: `${card.x}%`, top: `${card.y}%`,
                  transform: `rotate(${card.rotation}deg)`,
                  transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, z-index 0s",
                  animation: `float 8s ease-in-out ${Math.random() * 4}s infinite`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = `rotate(${card.rotation}deg) translateY(-8px) scale(1.02)`; e.currentTarget.style.zIndex = "50"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${card.rotation}deg)`; e.currentTarget.style.zIndex = `${card.z}`; }}
              >
                <div className="w-full h-full overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, #1E1E1E 0%, #141414 100%)`,
                    boxShadow: `0 2px 12px rgba(0,0,0,0.4), 0 8px 40px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.05)`,
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-smoke/80 via-[#1A1A1A]/60 to-smoke/70 transition-all duration-500 relative group-hover:from-smoke group-hover:via-[#1A1A1A]">
                    {thumb && <img src={thumb} alt={card.brand} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" loading="lazy" />}

                    <div className="relative z-10 text-center">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full border border-cinema-white/8 flex items-center justify-center group-hover:border-cinema-white/30 transition-colors duration-500">
                        {isVideo ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-stone group-hover:text-cinema-white transition-colors duration-500 ml-0.5">
                            <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-stone group-hover:text-cinema-white transition-colors duration-500">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <p className="text-caption font-switzer font-[500] text-stone uppercase tracking-[0.02em] leading-[1.2] group-hover:text-cinema-white transition-colors duration-500">{card.label}</p>
                      <p className="mt-1 text-[10px] font-switzer font-[400] text-cinema-white/25 uppercase tracking-[0.02em]">{card.sub}</p>
                      <p className="mt-1 text-[9px] font-switzer font-[400] text-cinema-white/25 uppercase tracking-[0.02em]">{card.brand} · {card.year}</p>
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-caption font-switzer font-[500] text-cinema-white uppercase tracking-[0.02em] text-[10px]">
                          {isVideo ? "Watch Campaign →" : card.doc ? "Open Document →" : "View Campaign →"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative z-30 flex justify-center mt-20 md:mt-24">
          <a href="#featured" className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cinema-black text-caption font-switzer font-[400] uppercase tracking-[0.02em] no-underline transition-opacity hover:opacity-85"
            style={{ borderRadius: "1440px" }}>
            Explore All Productions
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-cinema-black">
              <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      {video && <VideoModal url={video.url} title={video.title} onClose={() => setVideo(null)} />}
    </>
  );
}
