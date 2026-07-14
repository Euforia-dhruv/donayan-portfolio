"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useProjects } from "@/lib/convex/site-data";
import { getYouTubeThumbnail } from "@/lib/video-utils";
import ProjectCard from "@/components/ProjectCard";

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

export default function FeaturedProductions() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { projects } = useProjects();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold: 0.1 },
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
    <section id="all-productions" ref={sectionRef} className="relative py-20 overflow-hidden reveal bg-cinema-black">
      <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.12em] mb-3 reveal reveal-delay-1">
          The Full Archive
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

        <div className="columns-1 gap-8 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {items.map((item: any, i: number) => (
            <ProjectCard key={item._id} project={item} index={i} size="standard" />
          ))}
        </div>
      </div>
    </section>
  );
}
