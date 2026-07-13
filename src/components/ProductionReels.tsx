"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getYouTubeThumbnail, getYouTubeId } from "@/lib/video-utils";
import { getMediaUrl } from "@/lib/media";
import videoEntries from "@/data/video-entries.json";
import archiveData from "@/data/archive.json";

interface VideoEntry {
  id: number;
  url: string;
  title: string;
  brand: string;
  year: string;
  role: string;
  description: string;
  hasMp4: boolean;
  images: string[] | null;
  hasImage: boolean;
  videoUrl: string | null;
  w: number;
  h: number;
  colSpan: number;
  src: string | null;
}

interface ArchiveItem {
  url: string;
  title: string;
  brand: string;
  year: string;
  role: string;
  description: string;
}

function isYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function isInstagramUrl(url: string): boolean {
  return url.includes("instagram.com");
}

function getInstagramCode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:[a-zA-Z0-9_.-]+\/)?(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function extractVideoId(url: string): string | null {
  const yt = getYouTubeId(url);
  if (yt) return yt;
  return getInstagramCode(url);
}

const archiveLookup = new Map<string, ArchiveItem>();
for (const item of archiveData as ArchiveItem[]) {
  const id = extractVideoId(item.url);
  if (id) archiveLookup.set(id, item);
}

const ENTRIES: VideoEntry[] = videoEntries.map((e: any) => {
  const vidId = extractVideoId(e.url);
  const arch = vidId ? archiveLookup.get(vidId) : undefined;
  return {
    ...e,
    title: e.title || arch?.title || `Video ${e.id}`,
    brand: arch?.brand || "",
    year: arch?.year || "",
    role: arch?.role || "",
    description: arch?.description || "",
  };
});

const isPortrait = (w: number, h: number) => h > w;

function ReelCard({ entry }: { entry: VideoEntry }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const portrait = isPortrait(entry.w, entry.h);

  // Intersection Observer for autoplay/pause
  useEffect(() => {
    if (!entry.hasMp4 || videoFailed) return;
    const vid = videoRef.current;
    const el = cardRef.current;
    if (!vid || !el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (!vid) return;
        if (e.isIntersecting) {
          vid.currentTime = vid.currentTime || 0;
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [entry.hasMp4, videoFailed]);

  // Track loadedmetadata for skeleton
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onLoad = () => setLoaded(true);
    if (vid.readyState >= 1) setLoaded(true);
    vid.addEventListener("loadedmetadata", onLoad);
    return () => vid.removeEventListener("loadedmetadata", onLoad);
  }, []);

  const aspectRatio = `${entry.w} / ${entry.h}`;

  const renderMedia = () => {
    // Video entries — show video with skeleton
    if (entry.hasMp4 && !videoFailed && entry.videoUrl) {
      return (
        <>
          {!loaded && (
            <div className="absolute inset-0 bg-[#141414] animate-pulse" />
          )}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            className={`w-full h-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${portrait ? "object-contain" : "object-cover"}`}
            onError={() => { setVideoFailed(true); setLoaded(true); }}
            onCanPlay={() => setLoaded(true)}
          >
            <source src={`/api/video?url=${encodeURIComponent(entry.videoUrl!)}`} type="video/mp4" />
          </video>
        </>
      );
    }

    // Multi-image entries
    if (entry.images && entry.images.length > 0 && !imgError) {
      const validImages = entry.images;
      if (validImages.length === 1) {
        return (
          <img src={getMediaUrl(`/assets/archive/${validImages[0]}`)} alt="" className="w-full h-full object-cover" loading="lazy"
            onError={() => setImgError(true)} />
        );
      }
      return (
        <div className="w-full h-full grid gap-[2px]" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr" }}>
          <div className="col-span-2 row-span-1 w-full h-full">
            <img src={getMediaUrl(`/assets/archive/${validImages[0]}`)} alt="" className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
          </div>
          <div className="w-full h-full">
            <img src={getMediaUrl(`/assets/archive/${validImages[1]}`)} alt="" className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
          </div>
          <div className="w-full h-full">
            <img src={getMediaUrl(`/assets/archive/${validImages[2]}`)} alt="" className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
          </div>
          <div className="w-full h-full">
            <img src={getMediaUrl(`/assets/archive/${validImages[3]}`)} alt="" className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
          </div>
          <div className="col-span-2 row-span-1 w-full h-full flex justify-center">
            <img src={getMediaUrl(`/assets/archive/${validImages[4]}`)} alt="" className="h-full object-contain" loading="lazy" onError={() => setImgError(true)} />
          </div>
        </div>
      );
    }

    // Image from src field (documents)
    if (entry.src && !imgError) {
      return (
        <img src={getMediaUrl(entry.src)} alt="" className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
      );
    }

    // Single image from archive
    if (entry.hasImage && !imgError) {
      return (
        <img src={getMediaUrl(`/assets/archive/${entry.id}.jpg`)} alt="" className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
      );
    }

    // YouTube thumbnail
    if (isYoutubeUrl(entry.url)) {
      const thumb = getYouTubeThumbnail(entry.url);
      if (thumb) {
        return <img src={thumb} alt="" className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />;
      }
    }

    // Instagram or any remaining entry — show thumbnail with overlay
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#141414]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.4)" stroke="none" />
        </svg>
        <span className="text-xs font-switzer font-[400] text-white/40 uppercase tracking-[0.05em]">
          {entry.brand || "Instagram"}
        </span>
        <span className="text-[11px] font-switzer font-[400] text-white/30 px-4 py-1.5 border border-white/20 rounded-full">
          Watch Reel
        </span>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        borderRadius: "24px",
        backgroundColor: "#141414",
        aspectRatio,
        transform: hovered ? "scale(1.015)" : "scale(1)",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.5)"
          : "0 4px 12px rgba(0,0,0,0.3)",
        filter: hovered ? "brightness(1.05)" : "brightness(1)",
        transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.6s ease, filter 0.6s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (entry.url) window.open(entry.url, "_blank", "noopener,noreferrer");
      }}
    >
      {renderMedia()}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          borderRadius: "24px",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0) 60%)",
          opacity: hovered ? 1 : 0.7,
        }}
      />

      {/* Text overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          padding: "0 24px 28px",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "transform 350ms ease, opacity 350ms ease",
        }}
      >
        {entry.title && (
          <p className="font-switzer text-white font-semibold" style={{ fontSize: "18px", lineHeight: 1.25, marginBottom: "6px" }}>
            {entry.title}
          </p>
        )}
        {(entry.role || entry.year) && (
          <p className="font-switzer text-white/60" style={{ fontSize: "13px", lineHeight: 1.4, marginBottom: entry.description ? "8px" : "0" }}>
            {entry.role}{entry.role && entry.year ? " · " : ""}{entry.year}
          </p>
        )}
        {entry.description && (
          <p className="font-switzer text-white/80" style={{
            fontSize: "14px",
            lineHeight: 1.45,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {entry.description}
          </p>
        )}
      </div>

      {/* Play button for working videos */}
      {entry.hasMp4 && !videoFailed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500"
            style={{
              backgroundColor: hovered ? "rgba(200,162,77,0.9)" : "rgba(20,20,20,0.75)",
              transform: hovered ? "scale(1.05)" : "scale(0.85)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: hovered ? "#0A0A0A" : "#F5F5F2", marginLeft: "2px" }}>
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductionReels() {
  const [show, setShow] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); obs.unobserve(el); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="production-reels"
      ref={sectionRef}
      style={{
        backgroundColor: "#0A0A0A",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          paddingLeft: "clamp(32px, 5vw, 40px)",
          paddingRight: "clamp(32px, 5vw, 40px)",
        }}
      >
        <div
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <p className="text-xs font-switzer font-[400] uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(200,162,77,0.6)" }}>
            Production Archive
          </p>
          <h2 className="font-switzer font-[300] leading-[1] tracking-[-0.03em] mb-8" style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}>
            Production Reels
          </h2>
        </div>

        <div className="grid gap-6" style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoFlow: "dense",
        }}>
          {ENTRIES.map((entry, i) => (
            <div
              key={entry.id}
              style={{
                gridColumn: `span ${entry.colSpan}`,
                opacity: 0,
                animation: show
                  ? `cardEntrance 0.7s ease-out ${0.05 + i * 0.045}s forwards`
                  : "none",
              }}
            >
              <ReelCard entry={entry} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
