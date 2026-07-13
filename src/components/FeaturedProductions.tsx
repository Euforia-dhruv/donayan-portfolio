"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import archive from "@/data/archive.json";
import videoEntries from "@/data/video-entries.json";
import VideoModal from "@/components/VideoModal";
import { getYouTubeThumbnail, getYouTubeId, getPlatformLabel } from "@/lib/video-utils";
import { getMediaUrl } from "@/lib/media";

const categories = ["All", "Featured Campaigns", "Commercial Films", "Fashion Campaigns", "Celebrity Campaigns", "Brand Films", "Digital & Social Content", "Music Videos", "Behind the Scenes"];

function extractCode(url: string): string | null {
  if (!url) return null;
  const ig = url.match(/instagram\.com\/(?:[a-zA-Z0-9_.-]+\/)?(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  if (ig) return `ig:${ig[1]}`;
  const yt = getYouTubeId(url);
  if (yt) return `yt:${yt}`;
  return null;
}

const brandAliases: Record<string, string> = {
  "pathan brothers": "pathan bros",
  "idée": "idee",
  "pond's": "ponds",
  "oool": "oool digital",
  "deva's khayal": "deva",
  "the bubbling fish & nirala": "the bubbling fish",
};

function normalize(str: string): string {
  return str.toLowerCase().trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

const videoByCode = new Map<string, typeof videoEntries[0]>();
const videoByBrand = new Map<string, typeof videoEntries[0]>();
for (const ve of videoEntries) {
  const code = extractCode(ve.url);
  if (code) videoByCode.set(code, ve);
  if (ve.title) {
    const key = normalize(ve.title);
    videoByBrand.set(key, ve);
  }
}

function getVideoForArchive(item: typeof archive[0]): typeof videoEntries[0] | undefined {
  const code = extractCode(item.url);
  if (code) return videoByCode.get(code);
  let brand = normalize(item.brand);
  if (brandAliases[brand]) brand = brandAliases[brand];
  if (videoByBrand.has(brand)) return videoByBrand.get(brand);
  for (const [key, ve] of videoByBrand) {
    if (brand.includes(key) || key.includes(brand)) return ve;
  }
  return undefined;
}

export default function FeaturedProductions() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCat, setActiveCat] = useState("All");
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const items = useMemo(() => {
    const filtered = activeCat === "All" ? archive : archive.filter((p) => p.category === activeCat);
    const archiveItems = filtered.filter((p) => {
      const thumb = p.thumbnail || getYouTubeThumbnail(p.url) || "";
      if (thumb) return true;
      const ve = getVideoForArchive(p) as { hasMp4?: boolean; hasImage?: boolean; images?: string[] | null; src?: string | null } | undefined;
      if (ve && (ve.hasMp4 || ve.hasImage || (Array.isArray(ve.images) && ve.images.length > 0) || ve.src)) return true;
      if (p.documents && p.documents.length > 0) return true;
      return false;
    });

    if (activeCat !== "All") return archiveItems;

    const usedCodes = new Set(archiveItems.map((a) => {
      const ve = getVideoForArchive(a);
      return ve ? `${ve.id}` : null;
    }).filter(Boolean));

    const wallCards = (videoEntries as any[])
      .filter((v) => v.id >= 101 && v.src && !usedCodes.has(`${v.id}`))
      .map((v) => ({
        id: `wall-${v.id}`,
        title: v.title || "",
        brand: v.title || "",
        year: "",
        role: "",
        url: v.url || "",
        type: "image",
        category: "Brand Films",
        featured: false,
        thumbnail: "",
        description: "",
        documents: v.url ? [{ label: "View Document", path: v.url }] : [],
        _wallSrc: v.src as string,
      }));

    return [...archiveItems, ...wallCards];
  }, [activeCat]);

  const handleClick = (p: any) => {
    if (p._wallSrc) {
      const ve = (videoEntries as any[]).find((v) => `wall-${v.id}` === p.id);
      if (ve?.url) window.open(ve.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (p.url) setVideo({ url: p.url, title: p.title });
    else if (p.documents?.[0]?.path) window.open(p.documents[0].path, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section id="featured" ref={sectionRef} className="relative py-20 overflow-hidden reveal bg-cinema-black">
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-10">
          <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-3 reveal reveal-delay-1">Production Archive</p>
          <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] max-w-2xl mb-6 reveal reveal-delay-2">All Productions</h2>

          <div className="flex flex-wrap gap-2 mb-6 reveal reveal-delay-3">
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
            {items.map((p, i) => {
              const wp = p as any;
              const thumb = wp.thumbnail || getYouTubeThumbnail(wp.url) || "";
              const ve = wp._wallSrc ? null : getVideoForArchive(wp) as { hasMp4?: boolean; hasImage?: boolean; images?: string[] | null; src?: string | null; videoUrl?: string | null; id?: number } | undefined;
              const wallSrc = wp._wallSrc as string | undefined;
              const hasVideo = !!wp.url;
              const hasDoc = !!wp.documents?.[0]?.path;
              const hasMp4 = ve?.hasMp4 && ve?.videoUrl;
              const hasImages = Array.isArray(ve?.images) && ve.images.length > 0;
              const hasSrc = !!ve?.src;

              return (
                <div key={p.id} onClick={() => handleClick(p)} className={`group cursor-pointer reveal reveal-delay-${Math.min(i + 1, 5)}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#141414]">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={p.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : wallSrc ? (
                      <img
                        src={getMediaUrl(wallSrc)}
                        alt={p.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : hasMp4 ? (
                      <video
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        className="w-full h-full object-cover"
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                      >
                        <source src={`/api/video?url=${encodeURIComponent(ve!.videoUrl!)}`} type="video/mp4" />
                      </video>
                    ) : hasImages && ve!.images ? (
                      <img
                        src={getMediaUrl(`/assets/archive/${ve!.images[0]}`)}
                        alt={p.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : hasSrc ? (
                      <img
                        src={getMediaUrl(ve!.src!)}
                        alt={p.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (ve?.hasImage) ? (
                      <img
                        src={getMediaUrl(`/assets/archive/${ve!.id}.jpg`)}
                        alt={p.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#141414]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/90 via-cinema-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {p.category && <span className="text-caption font-switzer font-[400] text-cinema-white uppercase tracking-[0.02em]">{p.category}</span>}
                          {p.year && <span className="text-caption font-switzer font-[400] text-cinema-white/50 uppercase tracking-[0.02em]">{p.year}</span>}
                        </div>
                        <h3 className="text-body-sm md:text-body font-switzer font-[300] text-cinema-white leading-[1.1]">{p.brand || p.title}</h3>
                        {p.role && <p className="text-caption font-switzer font-[400] text-cinema-white/50 mt-1">{p.role}</p>}
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
                      {wallSrc && <span className="px-2 py-1 text-caption font-switzer font-[400] uppercase tracking-[0.02em] bg-smoke/80 text-stone">Document</span>}
                      {!p.url && !wallSrc && <span className="px-2 py-1 text-caption font-switzer font-[400] uppercase tracking-[0.02em] bg-smoke/80 text-stone">Document</span>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-body-sm md:text-body font-switzer font-[300] text-cinema-white leading-[1.2] group-hover:text-stone transition-colors duration-500">{p.brand || p.title}</h3>
                    <p className="text-caption font-switzer font-[400] text-stone mt-0.5">{p.role}{p.role && p.year ? " · " : ""}{p.year}</p>
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
