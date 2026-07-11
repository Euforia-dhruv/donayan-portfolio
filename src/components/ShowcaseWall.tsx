"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import archive from "@/data/archive.json";
import galleryCards from "@/data/gallery-cards.json";
import { getYouTubeAutoplayUrl, getYouTubeThumbnail, getPlatformLabel, getDurationLabel, isEmbeddable } from "@/lib/video-utils";

interface WallItem {
  id: string;
  type: "youtube" | "instagram" | "image" | "document";
  src: string;
  thumbnail: string;
  title: string;
  brand: string;
  year: string;
  category: string;
  role: string;
  aspect: string;
  span: number;
}

const localImages = [
  { src: "/assets/work-images/WhatsApp Image 2026-07-11 at 12.00.50 PM (1).jpeg", brand: "Set Photography", year: "2025", category: "BTS Photography" },
  { src: "/assets/work-images/WhatsApp Image 2026-07-11 at 12.00.50 PM.jpeg", brand: "Set Photography", year: "2025", category: "BTS Photography" },
  { src: "/assets/work-images/WhatsApp Image 2026-07-11 at 12.00.51 PM (1).jpeg", brand: "Production Still", year: "2025", category: "Production Stills" },
  { src: "/assets/work-images/WhatsApp Image 2026-07-11 at 12.00.51 PM.jpeg", brand: "Production Still", year: "2025", category: "Production Stills" },
  { src: "/assets/work-images/WhatsApp Image 2026-07-11 at 12.00.52 PM (1).jpeg", brand: "Campaign Still", year: "2025", category: "Production Stills" },
  { src: "/assets/work-images/WhatsApp Image 2026-07-11 at 12.00.52 PM.jpeg", brand: "Campaign Still", year: "2025", category: "Production Stills" },
];

function buildItems(): WallItem[] {
  const items: WallItem[] = [];

  archive.forEach((a) => {
    const isVideo = a.type === "youtube" || a.type === "instagram";
    const thumb = a.thumbnail || getYouTubeThumbnail(a.url) || "";
    const isInsta = a.type === "instagram";
    items.push({
      id: a.id,
      type: isInsta ? "instagram" : isVideo ? "youtube" : "document",
      src: a.url,
      thumbnail: thumb || "",
      title: a.title,
      brand: a.brand,
      year: a.year,
      category: a.category,
      role: a.role,
      aspect: isInsta ? "9/16" : isVideo ? "16/9" : "4/5",
      span: 0,
    });
  });

  localImages.forEach((img, i) => {
    items.push({
      id: `local-${i}`,
      type: "image",
      src: img.src,
      thumbnail: img.src,
      title: img.brand,
      brand: img.brand,
      year: img.year,
      category: img.category,
      role: "Production",
      aspect: ["4/3", "1/1", "16/9", "3/4", "4/5", "1/1"][i % 6],
      span: 0,
    });
  });

  galleryCards.forEach((c, i) => {
    const matched = archive.find(
      (a) => a.brand.toLowerCase() === c.brand.toLowerCase() && a.url
    );
    const thumb = matched ? getYouTubeThumbnail(matched.url) : "";
    items.push({
      id: `wall-${c.id}`,
      type: matched && matched.url ? "youtube" : "document",
      src: matched?.url || c.doc || "",
      thumbnail: thumb || "",
      title: c.label,
      brand: c.brand,
      year: c.year,
      category: c.sub,
      role: "Production Document",
      aspect: `${c.width}/${c.height}`,
      span: 0,
    });
  });

  items.forEach((item) => {
    const aspect = item.aspect.split("/").map(Number);
    const ratio = aspect[1] / aspect[0];
    if (ratio < 0.6) item.span = 1;
    else if (ratio < 0.8) item.span = [1, 2][Math.floor(Math.random() * 2)];
    else if (ratio < 1.1) item.span = [1, 2, 2][Math.floor(Math.random() * 3)];
    else if (ratio < 1.4) item.span = [1, 2][Math.floor(Math.random() * 2)];
    else item.span = 2;
  });

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function ShowcaseItem({
  item,
  index,
  setVideo,
}: {
  item: WallItem;
  index: number;
  setVideo: (v: { url: string; title: string } | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) el.style.opacity = "1";
      },
      { rootMargin: "200px", threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const ifr = iframeRef.current;
    if (!ifr || item.type !== "youtube") return;
    if (visible && isHovered) {
      ifr.src = getYouTubeAutoplayUrl(item.src) || "";
    } else {
      ifr.src = "";
    }
  }, [visible, isHovered, item.src, item.type]);

  const isVideoCard = item.type === "youtube" || item.type === "instagram";
  const isYoutube = item.type === "youtube";
  const embedUrl = isYoutube ? getYouTubeAutoplayUrl(item.src) : null;
  const delay = Math.min(index * 0.04, 1.2);

  return (
    <div
      ref={ref}
      className="break-inside-avoid mb-4 md:mb-5 relative group cursor-pointer"
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        animation: `heroFade 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s forwards`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (item.src && isVideoCard) setVideo({ url: item.src, title: item.title });
      }}
    >
      <div
        className="relative w-full overflow-hidden rounded-xl bg-dew-drop"
        style={{ aspectRatio: item.aspect }}
      >
        {(item.type === "image" || !isYoutube) && item.thumbnail && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ filter: isHovered ? "brightness(1.02)" : "brightness(0.95)" }}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
        )}

        {isYoutube && embedUrl && isHovered && visible && (
          <iframe
            ref={iframeRef}
            src={embedUrl}
            className="absolute inset-0 w-full h-full pointer-events-none"
            allow="autoplay; muted"
            title={item.title}
          />
        )}

        {isYoutube && item.thumbnail && !(isHovered && visible) && (
          <img
            src={item.thumbnail}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ filter: "brightness(0.95)" }}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
        )}

        {item.type === "document" && !item.thumbnail && (
          <div className="absolute inset-0 flex items-center justify-center bg-dew-drop">
            <div className="text-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto text-charcoal/20 mb-2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="font-geist font-[400] text-charcoal/30 uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>{item.brand}</p>
            </div>
          </div>
        )}

        {isVideoCard && !isHovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cream-paper/80 border border-charcoal/20 flex items-center justify-center transition-all duration-300 group-hover:bg-cream-paper group-hover:scale-110">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                <path d="M8 5v14l11-7L8 5z" fill="#171717" />
              </svg>
            </div>
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4 md:p-5"
          style={{ transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)" }}
        >
          <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-400" style={{ transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)" }}>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-geist font-[500] text-cream-paper/70 uppercase" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                {item.category}
              </span>
              <span className="text-cream-paper/40" style={{ fontSize: "9px" }}>·</span>
              <span className="font-geist font-[400] text-cream-paper/40 uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
                {item.year}
              </span>
            </div>
            <p className="font-gelica font-[400] text-cream-paper leading-[1.2]" style={{ fontSize: "clamp(13px, 1.2vw, 15px)" }}>
              {item.brand}
            </p>
            <p className="font-geist font-[400] text-cream-paper/50 mt-0.5 uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>
              {item.role}
            </p>
            <p className="font-geist font-[500] text-cream-paper/80 mt-2 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
              View {isVideoCard ? "Project" : "Case Study"} →
            </p>
          </div>
        </div>

        {isVideoCard && (
          <div className="absolute top-3 left-3 px-2 py-0.5 font-geist font-[500] uppercase rounded bg-cream-paper/80 text-charcoal/70 backdrop-blur-sm" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
            {getPlatformLabel(item.src)}
          </div>
        )}

        {isVideoCard && (
          <div className="absolute top-3 right-3 px-2 py-0.5 font-geist font-[400] uppercase rounded bg-cream-paper/80 text-charcoal/50 backdrop-blur-sm" style={{ fontSize: "9px", letterSpacing: "0.1em" }}>
            {getDurationLabel(item.src)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShowcaseWall() {
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null);
  const items = useMemo(() => buildItems(), []);

  const handleClose = useCallback(() => setVideo(null), []);

  return (
    <>
      <section className="py-20 md:py-28 bg-cream-paper border-t border-charcoal/10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8">
          <div className="mb-12 md:mb-16">
            <p className="font-geist font-[500] text-charcoal/50 uppercase reveal" style={{ fontSize: "12px", letterSpacing: "0.2em" }}>
              The Archive
            </p>
            <h2 className="font-gelica font-[500] text-cocoa-ink leading-[1.08] mt-2 reveal reveal-delay-2 lowercase"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
              showcase
            </h2>
          </div>

          <div
            className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-5"
            style={{ columnFill: "balance" }}
          >
            {items.map((item, i) => (
              <ShowcaseItem key={item.id} item={item} index={i} setVideo={setVideo} />
            ))}
          </div>
        </div>
      </section>

      {video && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-xl"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-5xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 text-cream-paper/60 hover:text-cream-paper font-geist uppercase bg-transparent border-none cursor-pointer transition-colors z-10"
              style={{ fontSize: "12px", letterSpacing: "0.15em" }}
            >
              Close [ESC]
            </button>
            <p className="font-geist font-[400] text-cream-paper/50 mb-3 truncate pr-20" style={{ fontSize: "13px" }}>
              {video.title}
            </p>
            <div className="relative aspect-video bg-dew-drop rounded-xl overflow-hidden">
              {isEmbeddable(video.url) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${video.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)?.[1] || ""}?rel=0&modestbranding=1&autoplay=1`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-dew-drop">
                  <div className="text-center">
                    <p className="font-geist font-[400] text-charcoal/40 mb-4" style={{ fontSize: "13px" }}>
                      Open on Instagram to view
                    </p>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal text-cream-paper font-geist font-[500] uppercase no-underline transition-all duration-300 rounded-xl"
                      style={{ fontSize: "11px", letterSpacing: "0.15em" }}
                    >
                      Open on Instagram
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
