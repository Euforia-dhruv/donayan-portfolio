"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode, type PointerEvent } from "react";
import Image from "next/image";
import { getYouTubeId } from "@/lib/video-utils";
import type { ArchiveItem } from "@/lib/archive";

function IconBtn({
  children,
  label,
  onClick,
  primary,
  href,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  href?: string;
}) {
  const cls = `flex h-10 min-w-[40px] items-center justify-center gap-2 rounded-full border px-3 text-caption font-switzer font-[400] uppercase tracking-[0.04em] transition-colors ${
    primary
      ? "border-gold bg-gold text-cinema-black hover:bg-gold/90"
      : "border-white/15 bg-white/5 text-white hover:bg-white/15"
  }`;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>
      {children}
    </button>
  );
}

export default function MediaViewer({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: ArchiveItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const item = items[index];
  const [muted, setMuted] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [page, setPage] = useState(1);
  const startX = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const total = items.length;
  const go = useCallback(
    (dir: number) => onNavigate((index + dir + total) % total),
    [index, total, onNavigate],
  );

  useEffect(() => {
    setZoom(1);
    setPage(1);
    setMuted(true);
  }, [index]);

  const toggleFullscreen = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === " " && item?.kind === "video") {
        e.preventDefault();
        const v = videoRef.current;
        if (v) v.paused ? v.play() : v.pause();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onClose, item?.kind]);

  if (!item) return null;

  const ytId = item.kind === "youtube" ? getYouTubeId(item.source) : null;
  const playable = item.kind === "video" || item.kind === "youtube";

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 80) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur-md"
    >
      {/* top bar */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="min-w-0">
          {item.platform && (
            <p className="text-caption font-switzer uppercase tracking-[0.12em] text-gold/70">
              {item.platform}
            </p>
          )}
          <h2 className="truncate font-switzer text-body-md font-[300] text-white">
            {item.title}
          </h2>
          {item.client && (
            <p className="text-caption font-switzer text-white/50">
              Client · {item.client}
              {item.year ? ` · ${item.year}` : ""}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {playable && (
            <IconBtn label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((m) => !m)}>
              {muted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4V5z" strokeLinejoin="round" /><path d="M22 9l-6 6M16 9l6 6" strokeLinecap="round" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4V5z" strokeLinejoin="round" /><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" strokeLinecap="round" /></svg>
              )}
            </IconBtn>
          )}
          {item.kind === "video" && (
            <IconBtn label="Fullscreen" onClick={toggleFullscreen}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </IconBtn>
          )}
          <IconBtn label="Previous" onClick={() => go(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </IconBtn>
          <span className="px-1 text-caption font-switzer text-white/40">
            {index + 1} / {total}
          </span>
          <IconBtn label="Next" onClick={() => go(1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </IconBtn>
          {item.kind === "pdf" && item.pdf && (
            <IconBtn label="Open PDF" href={item.pdf} primary>
              Open
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </IconBtn>
          )}
          {item.source && (
            <IconBtn label="Open original" href={item.source}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </IconBtn>
          )}
          <IconBtn label="Close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </IconBtn>
        </div>
      </div>

      {/* content */}
      <div
        className="relative flex-1 overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {item.kind === "video" && item.preview && (
          <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
            <video
              key={`${index}-${muted}`}
              ref={videoRef}
              src={item.preview}
              poster={item.poster || undefined}
              controls
              autoPlay
              loop
              playsInline
              muted={muted}
              className="max-h-full max-w-full rounded-xl bg-black"
            />
          </div>
        )}

        {item.kind === "youtube" && ytId && (
          <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
            <iframe
              key={`${index}-${muted}`}
              className="aspect-video max-h-full w-full max-w-[1200px] rounded-xl"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              title={item.title}
            />
          </div>
        )}

        {item.kind === "instagram" && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
            {item.poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.poster}
                alt={item.title}
                className="max-h-[70vh] w-auto rounded-xl object-contain"
              />
            )}
            <a
              href={item.source}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gold bg-gold px-6 py-3 font-switzer text-caption uppercase tracking-[0.06em] text-cinema-black transition-colors hover:bg-gold/90"
            >
              View on Instagram
            </a>
          </div>
        )}

        {item.kind === "image" && item.preview && (
          <div className="h-full w-full">
            <Image
              src={item.preview}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        )}

        {item.kind === "pdf" && item.pdf && (
          <div className="flex h-full w-full flex-col">
            <div className="flex flex-wrap items-center justify-center gap-2 py-3">
              <IconBtn label="Previous page" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                − Page
              </IconBtn>
              <span className="px-2 text-caption text-white/60">Page {page}</span>
              <IconBtn label="Next page" onClick={() => setPage((p) => p + 1)}>
                + Page
              </IconBtn>
              <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}>
                − Zoom
              </IconBtn>
              <span className="px-2 text-caption text-white/60">{Math.round(zoom * 100)}%</span>
              <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}>
                + Zoom
              </IconBtn>
            </div>
            <iframe
              key={`${page}-${zoom}`}
              src={`${item.pdf}#page=${page}&zoom=${Math.round(zoom * 100)}`}
              title={item.title}
              className="w-full flex-1 bg-white"
            />
          </div>
        )}
      </div>

      {/* caption */}
      {(item.credits.length > 0 || item.tags.length > 0) && (
        <div className="border-t border-white/10 px-5 py-4 sm:px-8">
          {item.credits.map((c, i) => (
            <p key={i} className="text-[12px] font-switzer font-[300] leading-snug text-white/70">
              {c}
            </p>
          ))}
          {item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-switzer uppercase tracking-[0.04em] text-white/60"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
