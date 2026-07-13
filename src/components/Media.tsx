"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { getYouTubeThumbnail } from "@/lib/video-utils";

export type MediaKind =
  | "image"
  | "video"
  | "pdf"
  | "youtube"
  | "instagram"
  | "behance"
  | "external";

export interface MediaSource {
  src?: string;
  externalUrl?: string;
  poster?: string;
  alt?: string;
}

export function resolveMedia(source: MediaSource): {
  kind: MediaKind;
  displaySrc?: string;
  link?: string;
} {
  const { src, externalUrl } = source;
  const link = externalUrl || src;

  const isImage = (u?: string) =>
    !!u && /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i.test(u);
  const isVideoFile = (u?: string) => !!u && /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(u);
  const isPdf = (u?: string) => !!u && /\.pdf(\?|$)/i.test(u);
  const isYouTube = (u?: string) =>
    !!u && (u.includes("youtube.com") || u.includes("youtu.be"));
  const isInstagram = (u?: string) => !!u && u.includes("instagram.com");
  const isBehance = (u?: string) => !!u && u.includes("behance.net");

  if (isPdf(src)) return { kind: "pdf", displaySrc: src, link };
  if (isImage(src)) return { kind: "image", displaySrc: src, link };
  if (isVideoFile(src)) return { kind: "video", displaySrc: src, link };

  if (isYouTube(src) || isYouTube(externalUrl)) {
    const yt = src && isYouTube(src) ? src : externalUrl!;
    return { kind: "youtube", displaySrc: getYouTubeThumbnail(yt) ?? undefined, link: yt };
  }
  if (isInstagram(src) || isInstagram(externalUrl)) {
    const ig = src && isInstagram(src) ? src : externalUrl!;
    return {
      kind: "instagram",
      displaySrc: src && !isInstagram(src) ? src : undefined,
      link: ig,
    };
  }
  if (isBehance(src) || isBehance(externalUrl)) {
    const bh = src && isBehance(src) ? src : externalUrl!;
    return {
      kind: "behance",
      displaySrc: src && !isBehance(src) ? src : undefined,
      link: bh,
    };
  }
  if (src) return { kind: "image", displaySrc: src, link };
  return { kind: "external", displaySrc: undefined, link };
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function Shimmer() {
  return (
    <div className="absolute inset-0 bg-charcoal animate-pulse" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
    </div>
  );
}

function Placeholder({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-charcoal to-black px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur">
        <PlayIcon className="h-5 w-5 text-cinema-white/80" />
      </div>
      {label && (
        <p className="text-caption font-switzer uppercase tracking-[0.02em] text-stone">
          {label}
        </p>
      )}
    </div>
  );
}

export interface MediaProps {
  source: MediaSource;
  alt?: string;
  label?: string;
  fill?: boolean;
  className?: string;
  showPlay?: boolean;
  priority?: boolean;
  rounded?: boolean;
  sizes?: string;
  onError?: () => void;
}

export function Media({
  source,
  alt,
  label,
  fill = true,
  className = "",
  showPlay = false,
  priority = false,
  rounded = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  onError,
}: MediaProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const { kind, displaySrc, link } = useMemo(
    () => resolveMedia(source),
    [source.src, source.externalUrl, source.poster, source.alt],
  );

  const wrapper = fill ? "absolute inset-0" : "relative w-full h-full";
  const radius = rounded ? "rounded-2xl" : "";

  const needsPlaceholder =
    errored ||
    kind === "external" ||
    ((kind === "instagram" || kind === "behance") && !displaySrc);

  if (needsPlaceholder) {
    return (
      <div className={`${wrapper} ${radius} ${className}`}>
        <Placeholder label={label} />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className={`${wrapper} ${radius} ${className} bg-black`}>
        {!loaded && <Shimmer />}
        <video
          src={displaySrc}
          poster={source.poster}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setLoaded(true)}
          onError={() => {
            setErrored(true);
            onError?.();
          }}
        />
        {showPlay && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
              <PlayIcon className="h-6 w-6 text-cinema-white" />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (displaySrc) {
        const isPlayable = showPlay || kind === "youtube";
    return (
      <div className={`${wrapper} ${radius} ${className}`}>
        {!loaded && <Shimmer />}
        <Image
          src={displaySrc}
          alt={alt || label || "Media"}
          fill
          sizes={sizes}
          priority={priority}
          draggable={false}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setErrored(true);
            onError?.();
          }}
        />
        {isPlayable && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
              <PlayIcon className="h-6 w-6 text-cinema-white" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${wrapper} ${radius} ${className}`}>
      <Placeholder label={label} />
    </div>
  );
}

export function isPlayableSource(source: MediaSource): boolean {
  const { kind } = resolveMedia(source);
  return (
    kind === "video" ||
    kind === "youtube" ||
    kind === "instagram" ||
    kind === "behance"
  );
}
