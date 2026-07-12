"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getYouTubeEmbedUrl, getYouTubeThumbnail, getYouTubeId } from "@/lib/video-utils";
import archiveData from "@/data/archive.json";

interface ReelEntry {
  id: number;
  url: string;
  hasMp4: boolean;
  hasThumb: boolean;
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

function getInstagramCode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:[a-zA-Z0-9_.-]+\/)?(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function extractVideoId(url: string): string | null {
  const yt = getYouTubeId(url);
  if (yt) return yt;
  return getInstagramCode(url);
}

function buildArchiveLookup(items: ArchiveItem[]): Map<string, ArchiveItem> {
  const map = new Map<string, ArchiveItem>();
  for (const item of items) {
    const id = extractVideoId(item.url);
    if (id) map.set(id, item);
  }
  return map;
}

const SPANS = [
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 1 }, { col: 2 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
];

const VALID_MP4 = new Set([
  1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 16, 17, 18, 19, 23, 24, 25, 26, 27, 28,
]);

const VALID_THUMBS = new Set([14, 15, 22, 6.1, 6.2, 6.3, 6.4, 6.5]);

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
          {entry.brand}{entry.brand && entry.title ? " — " : ""}{entry.title}
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
                style={{ background: "#C8A24D", color: "#0A0A0A", borderRadius: "6px" }}
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

function ReelVideo({ entry }: { entry: ReelEntry }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (e.isIntersecting) {
          vid.play().catch(() => {});
        } else if (playedRef.current) {
          vid.pause();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  let posterPath: string | undefined;
  if (entry.hasThumb) {
    posterPath = `/assets/videos/${entry.id}.jpg`;
  } else if (isYoutubeUrl(entry.url)) {
    posterPath = getYouTubeThumbnail(entry.url) ?? undefined;
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
          onPlay={() => { playedRef.current = true; }}
        />
      ) : (
        <>
          <img
            src={posterPath || ""}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              const t = e.currentTarget;
              if (t.dataset.fallback) return;
              t.dataset.fallback = "1";
              t.style.display = "none";
              const placeholder = t.parentElement?.querySelector(".reel-fallback");
              if (placeholder) (placeholder as HTMLElement).style.display = "flex";
            }}
          />
          <div className="reel-fallback absolute inset-0 items-center justify-center" style={{ display: "none", backgroundColor: "#1E1E1E" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(245,245,242,0.2)" }}>
              <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 17l5-5 3 3 4-4 6 6" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>
        </>
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)",
          borderRadius: "12px",
          transition: "opacity 0.35s ease",
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

      {/* Play button */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transition: "opacity 0.5s ease",
          opacity: hovered ? 1 : 0.7,
        }}
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
    </div>
  );
}

export default function ProductionReels() {
  const [entries, setEntries] = useState<ReelEntry[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [fetchState, setFetchState] = useState<"loading" | "loaded" | "error">("loading");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setMounted(true); },
      { threshold: 0.05 }
    );
    const el = sectionRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetch(TXT_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        const lines = text.trim().split("\n").filter(Boolean);
        console.log(`[ProductionReels] TXT loaded: ${lines.length} lines`);

        const archiveLookup = buildArchiveLookup(archiveData as ArchiveItem[]);
        const parsed: ReelEntry[] = [];

        for (const line of lines) {
          const numMatch = line.match(/^(\d+)/);
          if (!numMatch) {
            console.warn(`[ProductionReels] Skipped line (no number): "${line}"`);
            continue;
          }
          const id = parseInt(numMatch[0], 10);
          const url = line.slice(numMatch[0].length).trim();

          if (!url) {
            console.warn(`[ProductionReels] Skipped ID ${id}: empty URL`);
            continue;
          }

          const vidId = extractVideoId(url);
          const archive = vidId ? archiveLookup.get(vidId) : undefined;

          if (!archive) {
            console.log(`[ProductionReels] ID ${id}: no archive match for URL "${url}" (vidId=${vidId})`);
          }

          const hasMp4 = VALID_MP4.has(id);
          const hasThumb = VALID_THUMBS.has(id);

          if (!hasMp4 && !hasThumb) {
            console.log(`[ProductionReels] ID ${id}: no local MP4 or JPG, using thumbnail from URL`);
          }

          parsed.push({
            id,
            url,
            hasMp4,
            hasThumb,
            title: archive?.title || `Video ${id}`,
            brand: archive?.brand || "",
            year: archive?.year || "",
            role: archive?.role || "",
          });
        }

        console.log(`[ProductionReels] Parsed ${parsed.length} entries`);
        setEntries(parsed);
        setFetchState("loaded");
      })
      .catch((err) => {
        console.error("[ProductionReels] Failed to load:", err);
        setFetchState("error");
      });
  }, []);

  const activeEntry = lightbox
    ? entries.find((e) => `reel-${e.id}` === lightbox) || null
    : null;

  const sectionVisible = mounted || fetchState === "loaded";

  return (
    <section
      ref={sectionRef}
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="max-w-[1500px] mx-auto px-8 md:px-10">
        {/* Header */}
        <div
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? "translateY(0)" : "translateY(20px)",
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

        {/* Loading */}
        {fetchState === "loading" && (
          <div className="flex items-center justify-center py-24">
            <div
              className="w-8 h-8 rounded-full"
              style={{
                border: "2px solid rgba(245,245,242,0.1)",
                borderTopColor: "#C8A24D",
                animation: "spin 0.8s linear infinite",
              }}
            />
          </div>
        )}

        {/* Error */}
        {fetchState === "error" && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm font-switzer font-[400] mb-2" style={{ color: "rgba(245,245,242,0.4)" }}>
              Failed to load production reels
            </p>
            <p className="text-xs font-switzer font-[300]" style={{ color: "rgba(245,245,242,0.25)" }}>
              Check that <code className="text-xs" style={{ color: "rgba(200,162,77,0.6)" }}>public/assets/videos/TXT.txt</code> exists and is accessible
            </p>
          </div>
        )}

        {/* Grid — always rendered with proper layout */}
        {fetchState !== "loading" && (
          <div
            className="grid gap-6 md:gap-8"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              minHeight: entries.length > 0 ? "auto" : "200px",
              opacity: entries.length > 0 ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            {entries.map((entry, i) => {
              const span = SPANS[i % SPANS.length];
              return (
                <div
                  key={entry.id}
                  style={{
                    gridColumn: `span ${span.col}`,
                    visibility: "visible",
                  }}
                  onClick={() => setLightbox(`reel-${entry.id}`)}
                >
                  <div
                    style={{
                      opacity: 0,
                      animation: sectionVisible
                        ? `cardEntrance 0.7s ease-out ${0.05 + i * 0.06}s forwards`
                        : undefined,
                    }}
                  >
                    <ReelVideo entry={entry} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
