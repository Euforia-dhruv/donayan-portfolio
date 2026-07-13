"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useProjects } from "@/lib/convex/site-data";
import { getYouTubeThumbnail, getYouTubeId, getPlatformLabel } from "@/lib/video-utils";

const COLLAB_URLS = new Set([
  "https://www.instagram.com/reel/C9Hady1yVDJ/",
  "https://www.instagram.com/p/C6BbgzXoyLR/",
  "https://www.instagram.com/reel/C7RB6gGoVDQ/",
  "https://www.instagram.com/p/Cz-2Mi0C6Bg/",
]);

const VIRAL_TITLES = new Set([
  "Pronamel Active Shield",
  "Centrum Claims",
  "The Bear House",
  "Sprite Heat Happens",
  "Fossil SS'25",
  "Kinder Print Shoot",
  "IDEE Campaign",
  "Pathan Brothers",
]);

const filters = [
  { key: "all", label: "All" },
  { key: "commercials", label: "Commercials" },
  { key: "music-videos", label: "Music Videos" },
  { key: "brand-films", label: "Brand Films" },
  { key: "posts", label: "Posts" },
  { key: "reels", label: "Reels" },
  { key: "collaborations", label: "Collaborations" },
  { key: "viral", label: "Viral" },
];

function getItemFilterKeys(p: any): string[] {
  const keys: string[] = [];
  const url = p.externalUrl || "";
  const isIG = url.includes("instagram.com");
  const isReel = url.includes("/reel/");
  const isPost = isIG && !isReel;
  const isYT = url.includes("youtube") || url.includes("youtu.be");
  const cat = (p.category || "").toLowerCase();
  const hasVideo = (p.videos && p.videos.length > 0) || isYT || isIG;
  const hasThumb = !!p.thumbnail || !!getYouTubeThumbnail(url);

  if (cat.includes("commercial") || cat.includes("fashion") || cat.includes("celebrity")) keys.push("commercials");
  if (cat.includes("music")) keys.push("music-videos");
  if (cat.includes("brand")) keys.push("brand-films");
  if (cat.includes("behind")) keys.push("commercials");
  if (cat.includes("digital") || cat.includes("social")) {
    if (isReel) keys.push("reels");
    else if (isPost) keys.push("posts");
    else keys.push("reels");
  }
  if (isPost) keys.push("posts");
  if (isReel) keys.push("reels");
  if (isYT && !isReel) {
    if (cat.includes("commercial") || cat.includes("fashion") || cat.includes("celebrity")) keys.push("commercials");
    else if (cat.includes("music")) keys.push("music-videos");
    else if (cat.includes("brand")) keys.push("brand-films");
    else keys.push("commercials");
  }
  if (url && COLLAB_URLS.has(url)) keys.push("collaborations");
  if (p.featured || VIRAL_TITLES.has(p.title)) keys.push("viral");
  if (hasThumb || hasVideo) keys.push("all");
  return keys;
}

function ArchiveCard({ item, index }: { item: any; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const url = item.externalUrl || "";
  const thumb = item.thumbnail || getYouTubeThumbnail(url) || "";
  const isCollab = url && COLLAB_URLS.has(url);
  const isViral = item.featured || VIRAL_TITLES.has(item.title);
  const isVideo = (item.videos && item.videos.length > 0) || url.includes("youtube") || url.includes("instagram");

  if (!thumb && !isVideo) return null;

  return (
    <div className="break-inside-avoid mb-5" style={{
      opacity: 0,
      animation: `cardEntrance 0.6s ease ${0.03 + index * 0.025}s forwards`,
    }}>
      <div
        className="relative overflow-hidden cursor-pointer group"
        style={{
          borderRadius: "20px",
          backgroundColor: "#141414",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.5)" : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => { if (url) window.open(url, "_blank", "noopener,noreferrer"); }}
      >
        {thumb && !imgError ? (
          <img src={thumb} alt={item.title} className="w-full h-full object-cover"
            loading="lazy" onError={() => setImgError(true)}
            style={{ transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: hovered ? "scale(1.04)" : "scale(1)", minHeight: "200px" }}
          />
        ) : isVideo ? (
          <div className="w-full h-full flex items-center justify-center" style={{ minHeight: "200px", background: "linear-gradient(135deg,#1a1a1a,#0d0d0d)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.5" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </div>
        ) : null}

        {isVideo && thumb && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: hovered ? 0 : 0.85, transition: "opacity 0.4s ease" }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none transition-opacity duration-400"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 70%)",
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.4s ease",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none p-5"
          style={{ opacity: hovered ? 1 : 0.9, transition: "opacity 0.4s ease, transform 0.4s ease" }}
        >
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {item.year && (
              <span className="text-caption font-switzer font-[400] text-cinema-white/60 uppercase tracking-[0.02em]">
                {item.year}
              </span>
            )}
            {url && (
              <span className="text-caption font-switzer font-[400] text-cinema-white/40 uppercase tracking-[0.02em]">
                {getPlatformLabel(url)}
              </span>
            )}
          </div>
          <h3 className="text-body-sm md:text-body font-switzer font-[400] text-cinema-white leading-[1.15]">
            {item.brand || item.title}
          </h3>
          {item.role && (
            <p className="text-caption font-switzer font-[400] text-cinema-white/50 mt-0.5">
              {item.role}
            </p>
          )}
          {isCollab && (
            <p className="text-caption font-switzer font-[400] text-gold/80 uppercase tracking-[0.02em] mt-1.5 inline-flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
              </svg>
              Collaboration · @gireesh_sahdev
            </p>
          )}
          {isViral && !isCollab && (
            <span className="text-caption font-switzer font-[400] text-gold/60 uppercase tracking-[0.02em] mt-1 inline-block">
              Featured Campaign
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductions() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { projects } = useProjects();

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
    return (projects || []).filter((item: any) => {
      const keys = getItemFilterKeys(item);
      if (activeFilter === "all") return keys.includes("all");
      return keys.includes(activeFilter);
    });
  }, [projects, activeFilter]);

  return (
    <section id="featured" ref={sectionRef} className="relative py-20 overflow-hidden reveal bg-cinema-black">
      <div className="relative z-10 max-w-[1500px] mx-auto px-8 md:px-10">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-3 reveal reveal-delay-1">
          Production Archive
        </p>
        <h2 className="font-switzer font-[300] leading-[1] tracking-[-0.03em] max-w-2xl mb-6 reveal reveal-delay-2"
          style={{ fontSize: "clamp(28px, 3.5vw, 48px)", color: "#F5F5F2" }}>
          All Productions
        </h2>

        <div className="flex flex-wrap gap-2 mb-8 reveal reveal-delay-3">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`text-caption font-switzer font-[400] uppercase tracking-[0.02em] px-4 py-2 transition-all duration-300 cursor-pointer border ${
                activeFilter === f.key
                  ? "bg-gold text-cinema-black border-gold"
                  : "bg-transparent text-stone border-cinema-white/10 hover:border-cinema-white/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-body font-switzer font-[300] text-stone">
              No projects match this filter.
            </p>
          </div>
        )}

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
          {items.map((item: any, i: number) => (
            <ArchiveCard key={item._id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
