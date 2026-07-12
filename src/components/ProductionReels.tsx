"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getYouTubeEmbedUrl, getYouTubeThumbnail, getYouTubeId } from "@/lib/video-utils";
import archiveData from "@/data/archive.json";

interface ReelEntry {
  id: number;
  url: string;
  hasMp4: boolean;
  title: string;
  brand: string;
  year: string;
  role: string;
}

interface ArchiveItem {
  url: string;
  title: string;
  brand: string;
  year: string;
  role: string;
}

const TXT_URL = "/assets/videos/TXT.txt";

function isYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function isInstagramUrl(url: string): boolean {
  return url.includes("instagram.com");
}

function extractVideoId(url: string): string | null {
  const yt = getYouTubeId(url);
  if (yt) return yt;
  const ig = url.match(/(?:instagram\.com\/(?:p|reel|tv)\/)([a-zA-Z0-9_-]+)/);
  if (ig) return ig[1];
  return null;
}

function buildArchiveLookup(items: ArchiveItem[]): Map<string, ArchiveItem> {
  const map = new Map<string, ArchiveItem>();
  for (const item of items) {
    const id = extractVideoId(item.url);
    if (id) map.set(id, item);
  }
  return map;
}

// Grid span patterns for editorial masonry (4-col grid)
const SPANS = [
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 1, row: 1 },  // standard
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 1, row: 1 },  // standard
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 1, row: 1 },  // standard
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 1, row: 1 },  // standard
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 1, row: 1 },  // standard
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 2, row: 1 },  // wide
  { col: 1, row: 1 },  // standard
  { col: 1, row: 1 },  // standard
];

const VALID_MP4 = new Set([
  1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 16, 17, 18, 19, 23, 24, 25, 26, 27, 28,
]);

const THUMB_IDS = new Set([14, 15, 22]);

function ReelLightbox({ entry, onClose }: { entry: ReelEntry; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = isYoutubeUrl(entry.url) ? getYouTubeEmbedUrl(entry.url, true) : null;

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    const t = setTimeout(() => setLoaded(true), 300);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      clearTimeout(t);
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-sm font-switzer font-[400] uppercase tracking-[0.04em] bg-transparent border-none cursor-pointer z-10"
          style={{ color: "rgba(245,245,242,0.5)" }}
        >
          Close [ESC]
        </button>
        <p
          className="text-sm font-switzer font-[400] mb-3 truncate pr-20"
          style={{ color: "rgba(245,245,242,0.5)" }}
        >
          {entry.brand} — {entry.title}
        </p>
        <div className="relative aspect-video" style={{ backgroundColor: "#141414" }}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  border: "2px solid rgba(245,245,242,0.15)",
                  borderTopColor: "#F5F5F2",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            </div>
          )}
          {entry.hasMp4 ? (
            <video
              src={`/assets/videos/${entry.id}.mp4`}
              controls
              autoPlay
              className="w-full h-full object-contain"
              style={{ borderRadius: "0" }}
            />
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              title={entry.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <p className="text-sm font-switzer font-[300] text-center px-8" style={{ color: "rgba(245,245,242,0.4)" }}>
                Unable to embed this video
              </p>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-switzer font-[400] uppercase tracking-[0.08em] no-underline"
                style={{
                  background: "#C8A24D",
                  color: "#0A0A0A",
                  borderRadius: "6px",
                }}
              >
                Open Original
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 9.5l7-7M4 2.5h5.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReelVideo({ entry, lightboxId }: { entry: ReelEntry; lightboxId: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        const vid = videoRef.current;
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
  }, []);

  useEffect(() => {
    if (lightboxId === `reel-${entry.id}`) {
      const vid = videoRef.current;
      if (vid) { vid.pause(); }
    }
  }, [lightboxId, entry.id]);

  const posterPath: string | undefined = THUMB_IDS.has(entry.id)
    ? `/assets/videos/${entry.id}.jpg`
    : isYoutubeUrl(entry.url)
    ? (getYouTubeThumbnail(entry.url) ?? undefined)
    : undefined;

  return (
    <div
      ref={containerRef}
      data-reel-id={entry.id}
      className="relative overflow-hidden cursor-pointer group"
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
    >
      {entry.hasMp4 ? (
        <video
          ref={videoRef}
          src={`/assets/videos/${entry.id}.mp4`}
          poster={posterPath}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
          style={{ display: "block" }}
        />
      ) : (
        <>
          {posterPath ? (
            <img
              src={posterPath}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "#1E1E1E" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(245,245,242,0.2)" }}>
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="9.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M2 17l5-5 3 3 4-4 6 6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
          )}
          {isInstagramUrl(entry.url) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: "rgba(20,20,20,0.85)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#F5F5F2", marginLeft: "2px" }}>
                  <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                </svg>
              </div>
            </div>
          )}
        </>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-400"
        style={{
          opacity: hovered ? 1 : 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)",
          borderRadius: "12px",
        }}
      />

      {/* Bottom metadata */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none px-4 pb-4"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        <p className="text-xs font-switzer font-[500] uppercase tracking-[0.04em]" style={{ color: "rgba(245,245,242,0.75)" }}>
          {entry.brand}
        </p>
        <p className="text-xs font-switzer font-[400]" style={{ color: "rgba(245,245,242,0.45)" }}>
          {entry.role} · {entry.year}
        </p>
      </div>

      {/* Play button */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-500"
        style={{
          opacity: hovered ? 1 : 0.7,
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            backgroundColor: hovered ? "rgba(200,162,77,0.9)" : "rgba(20,20,20,0.8)",
            transform: hovered ? "scale(1)" : "scale(0.85)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: hovered ? "#0A0A0A" : "#F5F5F2", marginLeft: "2px" }}>
            <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ProductionReels() {
  const [entries, setEntries] = useState<ReelEntry[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    const el = sectionRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetch(TXT_URL)
      .then((r) => r.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const archiveLookup = buildArchiveLookup(archiveData as ArchiveItem[]);

        const parsed: ReelEntry[] = lines.map((line) => {
          const numMatch = line.match(/^(\d+)/);
          if (!numMatch) return null;
          const id = parseInt(numMatch[0], 10);
          const url = line.slice(numMatch[0].length).trim();
          const vidId = extractVideoId(url);
          const archive = vidId ? archiveLookup.get(vidId) : undefined;

          return {
            id,
            url,
            hasMp4: VALID_MP4.has(id),
            title: archive?.title || `Video ${id}`,
            brand: archive?.brand || "",
            year: archive?.year || "",
            role: archive?.role || "",
          };
        }).filter(Boolean) as ReelEntry[];

        setEntries(parsed);
      })
      .catch(() => {});
  }, []);

  const activeEntry = lightbox
    ? entries.find((e) => `reel-${e.id}` === lightbox) || null
    : null;

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="max-w-[1500px] mx-auto px-8 md:px-10">
        {/* Header */}
        <div
          className="mb-12 md:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
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
            className="font-switzer font-[300] leading-[1] tracking-[-0.03em]"
            style={{
              fontSize: "clamp(32px, 4vw, 54px)",
              color: "#F5F5F2",
            }}
          >
            Production Reels
          </h2>
        </div>

        {/* Grid */}
        <div
          className="grid gap-6 md:gap-8"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.15s",
          }}
        >
          {entries.map((entry, i) => {
            const span = SPANS[i % SPANS.length];
            return (
              <div
                key={entry.id}
                style={{
                  gridColumn: `span ${span.col}`,
                  opacity: 0,
                  animation: visible
                    ? `cardEntrance 0.7s ease-out ${0.05 + i * 0.06}s forwards`
                    : "none",
                }}
                onClick={() => setLightbox(`reel-${entry.id}`)}
              >
                <ReelVideo
                  entry={entry}
                  lightboxId={lightbox}
                />
              </div>
            );
          })}
        </div>
      </div>

      {activeEntry && (
        <ReelLightbox
          entry={activeEntry}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
