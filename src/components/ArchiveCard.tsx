"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { getYouTubeThumbnail } from "@/lib/video-utils";
import AutoVideo from "@/components/AutoVideo";
import { useTrack } from "../lib/useTrack";

function PlayIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function YouTubeGlyph({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.2 3.5z" />
    </svg>
  );
}

export default function ArchiveCard({
  item,
  index,
  onOpen,
}: {
  item: import("@/lib/archive").ArchiveItem;
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [posterErr, setPosterErr] = useState(false);
  const [sheen, setSheen] = useState({ x: 50, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const track = useTrack();

  // Normalize the aspect ratio so a missing/invalid value can never collapse
  // or shrink a card. Falls back to 16:9 (landscape) which is correct for
  // YouTube/film content.
  const safeAspect = (() => {
    const parts = String(item.aspect || "")
      .split("/")
      .map((n) => parseFloat(n.trim()))
      .filter((n) => !Number.isNaN(n));
    return parts.length === 2 && parts[1] > 0 ? item.aspect : "16 / 9";
  })();

  const isVideo = item.kind === "video";
  const isYouTube = item.kind === "youtube";
  const isPdf = item.kind === "pdf";
  const isInstagram = item.kind === "instagram";
  const hasPlay = isVideo || isYouTube || isInstagram;
  const mediaSrc = item.preview || item.poster;
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  // YouTube thumbnail: mqdefault (16:9, always generated) first, fall back to
  // hqdefault. Never show an empty dark block — a gradient sits behind it.
  const ytSrc = useMemo(() => {
    if (!isYouTube) return "";
    if (posterErr) return getYouTubeThumbnail(item.source, "hq") ?? "";
    return getYouTubeThumbnail(item.source, "mq") ?? "";
  }, [isYouTube, item.source, posterErr]);

  const onMove = (e: React.MouseEvent) => {
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setSheen({ x: px * 100, y: py * 100 });
  };

  // Parallax + scale driven by cursor position (smooth GPU transform).
  const mediaTransform = hovered
    ? `translate3d(${(sheen.x - 50) * 0.18}px, ${(sheen.y - 50) * 0.18}px, 0) scale(1.06)`
    : "translate3d(0,0,0) scale(1)";

  return (
    <article
      ref={cardRef}
      className="archive-card group relative mb-8 break-inside-avoid"
      style={{ animation: `cardEntrance 0.7s cubic-bezier(0.22,1,0.36,1) ${(0.05 + (index % 12) * 0.04).toFixed(2)}s both` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSheen({ x: 50, y: 0 });
      }}
      onMouseMove={onMove}
    >
      <button
        type="button"
        onClick={() => {
          const isProd = item.id.startsWith("prod-");
          if (isPdf)
            track("pdf_download", { refId: item.id, refTitle: item.title, path: "/archive" });
          else if (isInstagram)
            track("instagram_open", { refId: item.id, refTitle: item.title, path: "/archive" });
          else if (isYouTube)
            track("youtube_play", { refId: item.id, refTitle: item.title, path: "/archive" });
          else
            track(isProd ? "project_open" : "wall_open", {
              refId: item.id,
              refTitle: item.title,
              path: "/archive",
            });
          onOpen();
        }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="card-inner relative block w-full cursor-pointer overflow-hidden rounded-[26px] bg-charcoal text-left outline-none ring-1 ring-white/[0.06] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-gold"
        style={{
          aspectRatio: safeAspect,
          boxShadow: hovered
            ? "0 40px 90px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(200,162,77,0.18)"
            : "0 18px 50px -28px rgba(0,0,0,0.7)",
        }}
        aria-label={`${item.title} — view`}
      >
        {/* media layer (parallax) */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: mediaTransform }}
        >
          {isVideo && item.preview ? (
            <AutoVideo src={item.preview} poster={item.poster || undefined} mode="autoplay" sizes={sizes} />
          ) : isYouTube ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-black to-charcoal" />
              {ytSrc ? (
                <Image
                  src={ytSrc}
                  alt={item.title}
                  fill
                  sizes={sizes}
                  priority={index < 3}
                  className="object-cover"
                  onError={() => {
                    if (!posterErr) setPosterErr(true);
                  }}
                />
              ) : null}
            </>
          ) : mediaSrc && !imgErr ? (
            <>
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-charcoal to-black" />
              <Image
                src={mediaSrc}
                alt={item.title}
                fill
                sizes={sizes}
                priority={index < 3}
                className={`object-cover transition-[opacity,transform] duration-700 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  setImgErr(true);
                  if (isPdf) {
                    console.warn(
                      `[archive] Missing PDF thumbnail for "${item.title}" (${mediaSrc}) — showing placeholder.`,
                    );
                  }
                }}
              />
              {isPdf && (
                <div className="pointer-events-none absolute right-4 top-4 rounded-md bg-black/60 px-2.5 py-1 text-[10px] font-switzer uppercase tracking-[0.1em] text-white/85 backdrop-blur-md">
                  PDF
                </div>
              )}
            </>
          ) : (
            // Fallback: beautiful PDF/document placeholder when no media or thumbnail failed.
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-charcoal to-black px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="text-gold/80"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinejoin="round" /><path d="M14 3v6h6" strokeLinejoin="round" /><path d="M9 13h6M9 17h6" strokeLinecap="round" /></svg>
              </div>
              <p className="font-switzer text-caption font-[300] uppercase tracking-[0.08em] text-stone">
                {isPdf ? "Document" : item.title}
              </p>
            </div>
          )}
        </div>

        {/* cursor-following light reflection */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(60% 50% at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,0.16), transparent 70%)`,
          }}
        />
        {/* top sheen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0.14), transparent 60%)",
          }}
        />

        {/* big play badge for playable media */}
        {hasPlay && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={`flex items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25 transition-all duration-500 ${
                isYouTube ? "h-20 w-20" : "h-16 w-16"
              } ${hovered ? "scale-90 opacity-0" : "scale-100 opacity-95"}`}
            >
              {isYouTube ? <YouTubeGlyph className="ml-1 h-8 w-8" /> : <PlayIcon className="ml-1 h-7 w-7" />}
            </div>
          </div>
        )}

        {/* cinematic gradient + meta */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 p-6 sm:p-7 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0.92 }}
        >
          <div className="mb-2.5 flex flex-wrap items-center gap-2 text-[10px] font-switzer uppercase tracking-[0.14em]">
            {item.year && <span className="text-white/65">{item.year}</span>}
            {item.platform && <span className="text-white/40">{item.platform}</span>}
            {item.categoryLabel && <span className="text-gold/80">{item.categoryLabel}</span>}
          </div>

          <h3 className="font-switzer text-[clamp(20px,1.6vw,28px)] font-[300] leading-[1.08] text-white">
            {item.title}
          </h3>
          {item.client && item.client !== item.title && (
            <p className="mt-1.5 text-caption font-switzer font-[400] text-white/60">
              Client · {item.client}
            </p>
          )}

          {/* expandable metadata — fades in on hover */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              {(item.credits.length > 0 || item.tags.length > 0) && (
                <div className="mt-3.5 space-y-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {item.credits.slice(0, 3).map((c, i) => (
                    <p key={i} className="text-[11px] font-switzer font-[300] leading-snug text-white/75">
                      {c}
                    </p>
                  ))}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.slice(0, 4).map((t, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-switzer uppercase tracking-[0.04em] text-white/75"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {isPdf && (
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-switzer uppercase tracking-[0.08em] text-gold/90">
                  Open document
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}
