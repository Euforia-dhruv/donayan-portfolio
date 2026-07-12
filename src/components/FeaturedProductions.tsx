"use client";

import { useRef, useEffect, useState } from "react";
import archive from "@/data/archive.json";
import VideoModal from "@/components/VideoModal";
import { getYouTubeThumbnail, getPlatformLabel } from "@/lib/video-utils";

const categories = ["All", "Featured Campaigns", "Commercial Films", "Fashion Campaigns", "Celebrity Campaigns", "Brand Films", "Digital & Social Content", "Music Videos", "Behind the Scenes"];

export default function FeaturedProductions() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCat, setActiveCat] = useState("All");
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  const filtered = activeCat === "All" ? archive : archive.filter((p) => p.category === activeCat);
  const handleClick = (p: (typeof archive)[0]) => {
    if (p.url) setVideo({ url: p.url, title: p.title });
    else if (p.documents?.[0]?.path) window.open(p.documents[0].path, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section id="featured" ref={sectionRef} className="relative pt-10 md:pt-14 pb-6 md:pb-10 overflow-hidden reveal bg-cinema-black">
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-10">
          <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-3 reveal reveal-delay-1">Production Archive</p>
          <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] max-w-2xl mb-10 reveal reveal-delay-2">All Productions</h2>

          <div className="flex flex-wrap gap-2 mb-12 reveal reveal-delay-3">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)}
                className={`text-caption font-switzer font-[400] uppercase tracking-[0.02em] px-4 py-2 transition-all duration-300 cursor-pointer border ${
                  activeCat === cat ? "bg-gold text-cinema-black border-gold" : "bg-transparent text-stone border-cinema-white/10 hover:border-cinema-white/30"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((p, i) => {
              const thumb = p.thumbnail || getYouTubeThumbnail(p.url) || "";
              const hasVideo = !!p.url; const hasDoc = !!p.documents?.[0]?.path;
              return (
                <div key={p.id} onClick={() => handleClick(p)} className={`group cursor-pointer reveal reveal-delay-${Math.min(i + 1, 5)}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-cinema-white/8">
                    {thumb ? <img src={thumb} alt={p.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" loading="lazy" />
                      : <div className="w-full h-full flex items-center justify-center"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto text-stone mb-2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg><p className="text-caption text-stone font-switzer uppercase tracking-[0.02em]">{p.brand}</p></div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/90 via-cinema-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-caption font-switzer font-[400] text-cinema-white uppercase tracking-[0.02em]">{p.category}</span>
                          {p.year && <span className="text-caption font-switzer font-[400] text-cinema-white/50 uppercase tracking-[0.02em]">{p.year}</span>}
                        </div>
                        <h3 className="text-body-sm md:text-body font-switzer font-[300] text-cinema-white leading-[1.1]">{p.brand}</h3>
                        <p className="text-caption font-switzer font-[400] text-cinema-white/50 mt-1">{p.role}</p>
                        {p.description && <p className="text-caption font-switzer font-[300] text-cinema-white/40 mt-1 line-clamp-2">{p.description}</p>}
                        <div className="flex gap-3 mt-3">
                          {hasVideo && <span className="text-caption font-switzer font-[500] text-cinema-white uppercase tracking-[0.02em] inline-flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7L8 5z" fill="currentColor" /></svg>Watch Campaign</span>}
                          {hasDoc && <span className="text-caption font-switzer font-[400] text-cinema-white/50 uppercase tracking-[0.02em] inline-flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.2"/></svg>View Case Study</span>}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {p.featured && <span className="px-2 py-1 text-caption font-switzer font-[400] uppercase tracking-[0.02em] bg-smoke/80 text-cinema-white">Featured</span>}
                      {p.url && <span className="px-2 py-1 text-caption font-switzer font-[400] uppercase tracking-[0.02em] bg-smoke/80 text-stone">{getPlatformLabel(p.url)}</span>}
                      {!p.url && <span className="px-2 py-1 text-caption font-switzer font-[400] uppercase tracking-[0.02em] bg-smoke/80 text-stone">Document</span>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-body-sm md:text-body font-switzer font-[300] text-cinema-white leading-[1.2] group-hover:text-stone transition-colors duration-500">{p.brand}</h3>
                    <p className="text-caption font-switzer font-[400] text-stone mt-0.5">{p.role} · {p.year}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {video && <VideoModal url={video.url} title={video.title} onClose={() => setVideo(null)} />}
    </>
  );
}
