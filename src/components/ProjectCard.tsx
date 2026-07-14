"use client";

import Image from "next/image";
import { useState } from "react";
import { getYouTubeThumbnail, getPlatformLabel } from "@/lib/video-utils";
import AutoVideo from "@/components/AutoVideo";

function isLocalVideo(u?: string): boolean {
  return !!u && /^(\/|https?:\/\/)/i.test(u) && /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(u);
}

function ProjectCard({ project, index, size = "standard" }: {
  project: any;
  index: number;
  size?: "feature" | "standard";
}) {
  const [hovered, setHovered] = useState(false);

  const url = project.externalUrl || "";
  const isYT = url.includes("youtube") || url.includes("youtu.be");
  const isIG = url.includes("instagram.com");
  const hasLocalVideo = (project.videos || []).some(isLocalVideo);

  const thumb =
    project.thumbnail ||
    (isYT ? getYouTubeThumbnail(url) : "") ||
    (project.gallery && project.gallery[0]) ||
    "";

  const previewSrc = hasLocalVideo
    ? (project.videos || []).find(isLocalVideo)
    : undefined;

  const orientation = project.orientation || (isIG && url.includes("/reel/") ? "portrait" : "landscape");
  const aspect =
    size === "feature"
      ? "16 / 9"
      : orientation === "portrait"
        ? "9 / 16"
        : orientation === "square"
          ? "1 / 1"
          : "16 / 9";

  const client = project.brand || project.client || "";
  const title = project.title || client || "Untitled";
  const year = project.year || "";
  const category = project.category || "";
  const credits: string[] = project.credits || [];
  const tags: string[] = project.tags || [];

  const open = () => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="break-inside-avoid mb-5"
      style={{
        opacity: 0,
        animation: `cardEntrance 0.6s ease ${0.03 + index * 0.025}s forwards`,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-charcoal outline-none ring-gold/0 transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-gold"
        style={{
          aspectRatio: aspect,
          boxShadow: hovered
            ? "0 24px 60px rgba(0,0,0,0.55)"
            : "0 4px 14px rgba(0,0,0,0.25)",
        }}
        aria-label={`${title} — open original`}
      >
        {/* media layer */}
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
           {previewSrc ? (
            <AutoVideo src={previewSrc} poster={thumb || undefined} mode="autoplay" />
          ) : thumb ? (
            <Image
              src={thumb}
              alt={title}
              fill
              sizes={size === "feature" ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
              className="object-cover"
              priority={size === "feature" && index < 2}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal to-black">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white" opacity="0.4" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </div>
          )}
        </div>

        {/* play badge for external video when no local preview */}
        {!previewSrc && (isYT || isIG) && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-400"
            style={{ opacity: hovered ? 0 : 0.85 }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-cinema-white" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        )}

        {/* gradient + meta */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-100" style={{ opacity: hovered ? 1 : 0.55 }} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {year && (
              <span className="text-[10px] font-switzer uppercase tracking-[0.1em] text-cinema-white/60">{year}</span>
            )}
            {url && (
              <span className="text-[10px] font-switzer uppercase tracking-[0.1em] text-cinema-white/40">{getPlatformLabel(url)}</span>
            )}
            {category && (
              <span className="text-[10px] font-switzer uppercase tracking-[0.1em] text-gold/70">{category}</span>
            )}
          </div>

          <h3 className="font-switzer text-body-md font-[300] leading-[1.1] text-cinema-white">
            {title}
          </h3>

          {client && client !== title && (
            <p className="mt-0.5 text-caption font-switzer font-[400] text-cinema-white/55">Client · {client}</p>
          )}

          {hovered && (credits.length > 0 || tags.length > 0) && (
            <div className="mt-2.5 space-y-1.5">
              {credits.length > 0 && (
                <p className="text-[11px] font-switzer font-[300] leading-snug text-cinema-white/70">
                  {credits.slice(0, 3).join(" · ")}
                </p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 4).map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full border border-cinema-white/15 px-2.5 py-0.5 text-[10px] font-switzer uppercase tracking-[0.04em] text-cinema-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
