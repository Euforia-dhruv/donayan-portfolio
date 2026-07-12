"use client";

import { useEffect, useRef, useState } from "react";
import { getYouTubeThumbnail, getYouTubeId } from "@/lib/video-utils";
import videoEntries from "@/data/video-entries.json";
import archiveData from "@/data/archive.json";

interface VideoEntry {
  id: number;
  url: string;
  title: string;
  brand: string;
  year: string;
  role: string;
  hasMp4: boolean;
  images: string[] | null;
  hasImage: boolean;
  videoUrl: string | null;
}

interface ArchiveItem {
  url: string;
  title: string;
  brand: string;
  year: string;
  role: string;
}

function isYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
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

const ENTRIES: VideoEntry[] = videoEntries.map(
  (e: { id: number; url: string; hasMp4: boolean; images: string[] | null; hasImage: boolean; videoUrl: string | null }) => {
    const vidId = extractVideoId(e.url);
    const arch = vidId ? archiveLookup.get(vidId) : undefined;
    return {
      ...e,
      title: arch?.title || `Video ${e.id}`,
      brand: arch?.brand || "",
      year: arch?.year || "",
      role: arch?.role || "",
    };
  }
);

const SPANS = [
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 1 }, { col: 2 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
];

function ReelCard({ entry }: { entry: VideoEntry }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const isMultiImage = entry.images && entry.images.length > 1;
  const isSingleImage = !entry.hasMp4 && entry.hasImage && !isMultiImage;

  useEffect(() => {
    if (!entry.hasMp4) return;
    const el = containerRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;
    vid.load();
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!vid) return;
        if (e.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [entry.hasMp4]);

  // Determine what to render
  const renderContent = () => {
    // Video entry
    if (entry.hasMp4 && !videoFailed) {
      return (
        <video
          ref={videoRef}
          src={entry.videoUrl || `/assets/archive/${entry.id}.mp4`}
          muted
          loop
          playsInline
          autoPlay
          className="w-full h-full object-contain"
          onError={() => setVideoFailed(true)}
        />
      );
    }

    // Multi-image collage (ID 6)
    if (isMultiImage && entry.images) {
      const validImages = entry.images.filter((img) => !imgErrors.has(img));
      if (validImages.length === 0) {
        return <MediaUnavailable />;
      }
      if (validImages.length === 1) {
        return (
          <img
            src={`/assets/archive/${validImages[0]}`}
            alt=""
            className="w-full h-full object-contain"
            onError={() => setImgErrors((prev) => new Set(prev).add(validImages[0]))}
          />
        );
      }
      return (
        <div className="w-full h-full grid gap-[2px]" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr" }}>
          <div style={{ gridColumn: "1 / 3", gridRow: "1 / 2" }} className="w-full h-full">
            <img src={`/assets/archive/${validImages[0]}`} alt="" className="w-full h-full object-contain" onError={() => setImgErrors((prev) => new Set(prev).add(validImages[0]))} />
          </div>
          <div className="w-full h-full">
            <img src={`/assets/archive/${validImages[1]}`} alt="" className="w-full h-full object-contain" onError={() => setImgErrors((prev) => new Set(prev).add(validImages[1]))} />
          </div>
          <div className="w-full h-full">
            <img src={`/assets/archive/${validImages[2]}`} alt="" className="w-full h-full object-contain" onError={() => setImgErrors((prev) => new Set(prev).add(validImages[2]))} />
          </div>
          <div className="w-full h-full">
            <img src={`/assets/archive/${validImages[3]}`} alt="" className="w-full h-full object-contain" onError={() => setImgErrors((prev) => new Set(prev).add(validImages[3]))} />
          </div>
          <div style={{ gridColumn: "1 / 3", gridRow: "3 / 4" }} className="w-full h-full flex justify-center">
            <img src={`/assets/archive/${validImages[4]}`} alt="" className="h-full object-contain" onError={() => setImgErrors((prev) => new Set(prev).add(validImages[4]))} />
          </div>
        </div>
      );
    }

    // Single image entry
    if (isSingleImage) {
      return (
          <img
            src={`/assets/archive/${entry.id}.jpg`}
            alt=""
            className="w-full h-full object-contain"
            onError={() => setVideoFailed(true)}
          />
      );
    }

    // Fallback: try YouTube thumbnail
    if (isYoutubeUrl(entry.url)) {
      return (
        <img
          src={getYouTubeThumbnail(entry.url) || ""}
          alt=""
          className="w-full h-full object-contain"
          onError={() => setVideoFailed(true)}
        />
      );
    }

    return <MediaUnavailable />;
  };

  if (!entry.hasMp4 && !entry.hasImage && !entry.images && !isYoutubeUrl(entry.url)) {
    console.warn("Missing media:", entry.id);
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: "12px",
        backgroundColor: "#141414",
        aspectRatio: "16 / 9",
        transition: "transform 0.5s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.5s ease, filter 0.5s ease",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.3)",
        filter: hovered ? "brightness(1.08)" : "brightness(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => entry.url && window.open(entry.url, "_blank")}
    >
      {renderContent()}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "12px",
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Metadata */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none px-4 pb-4"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {entry.brand && (
          <p className="text-xs font-switzer font-[500] uppercase tracking-[0.04em]" style={{ color: "rgba(245,245,242,0.75)" }}>
            {entry.brand}
          </p>
        )}
        {(entry.role || entry.year) && (
          <p className="text-xs font-switzer font-[400]" style={{ color: "rgba(245,245,242,0.45)" }}>
            {entry.role}{entry.role && entry.year ? " · " : ""}{entry.year}
          </p>
        )}
      </div>

      {/* Play button — only for video entries */}
      {entry.hasMp4 && !videoFailed && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: hovered ? 1 : 0.7, transition: "opacity 0.5s ease" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: hovered ? "rgba(200,162,77,0.9)" : "rgba(20,20,20,0.8)",
              transform: hovered ? "scale(1)" : "scale(0.85)",
              transition: "all 0.5s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: hovered ? "#0A0A0A" : "#F5F5F2", marginLeft: "2px" }}>
              <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaUnavailable() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ backgroundColor: "#1E1E1E", color: "rgba(245,245,242,0.3)" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <circle cx="10" cy="10" r="2" />
        <path d="M2 17l5-5 3 3 4-4 6 6" />
      </svg>
      <span className="text-xs font-switzer font-[400]">Media unavailable</span>
    </div>
  );
}

export default function ProductionReels() {
  const [show, setShow] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShow(true); },
      { threshold: 0.05 }
    );
    const el = sectionRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="production-reels"
      ref={sectionRef}
      style={{
        backgroundColor: "#0A0A0A",
        paddingTop: "180px",
        paddingBottom: "120px",
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
        {/* Header */}
        <div
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <p
            className="text-xs font-switzer font-[400] uppercase tracking-[0.12em] mb-3"
            style={{ color: "rgba(200,162,77,0.6)" }}
          >
            Production Archive
          </p>
          <h2
            className="font-switzer font-[300] leading-[1] tracking-[-0.03em] mb-12 md:mb-16"
            style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}
          >
            Production Reels
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-5 md:gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {ENTRIES.map((entry, i) => {
            const span = SPANS[i % SPANS.length];
            return (
              <div
                key={entry.id}
                style={{
                  gridColumn: `span ${span.col}`,
                  opacity: 0,
                  animation: show
                    ? `cardEntrance 0.7s ease-out ${0.05 + i * 0.06}s forwards`
                    : "none",
                }}
              >
                <ReelCard entry={entry} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
