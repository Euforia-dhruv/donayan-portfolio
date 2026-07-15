"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import AutoVideo from "@/components/AutoVideo";
import {
  getYouTubeAutoplayUrl,
  getVimeoEmbedUrl,
} from "@/lib/video-utils";
import { parseAspect, type WallCardItem } from "@/lib/wall-items";

interface Filter {
  key: string;
  label: string;
}

const isImageUrl = (u?: string | null) =>
  !!u && /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(u);
const isVideoUrl = (u?: string | null) =>
  !!u && /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(u);
const isYouTube = (u?: string | null) => !!u && (u.includes("youtube.com") || u.includes("youtu.be"));
const isVimeo = (u?: string | null) => !!u && u.includes("vimeo.com");
const isInstagram = (u?: string | null) => !!u && u.includes("instagram.com");

function columnsForWidth(w: number): number {
  if (!w) return 2;
  if (w < 640) return 2;
  if (w < 1024) return 3;
  if (w < 1500) return 4;
  if (w < 1900) return 5;
  if (w < 2300) return 6;
  return 7;
}

function colSpanFor(item: WallCardItem, cols: number): number {
  if (item.uniform) return 1;
  if (cols < 4) return 1;
  if (parseAspect(item.aspect) >= 1.6) return 2;
  return 1;
}

/** Blur-up image using next/image (lazy, optimized, high quality). */
function BlurImage({
  src,
  alt,
  sizes,
  priority,
  rounded = "rounded-[14px]",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  rounded?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`absolute inset-0 flex items-center justify-center bg-charcoal bg-gradient-to-br from-charcoal to-black ${rounded}`}>
        <span className="font-switzer text-caption uppercase tracking-[0.18em] text-stone/60">{alt}</span>
      </div>
    );
  }
  return (
    <div className={`absolute inset-0 overflow-hidden ${rounded}`}>
      <div
        className="absolute inset-0 bg-charcoal transition-opacity duration-700"
        style={{ opacity: loaded ? 0 : 1 }}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={`object-cover transition-[opacity,filter] duration-700 ease-out ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-2xl"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/** Designed poster for a video that has no image thumbnail (never a black box). */
function DesignedPoster({ title, rounded = "rounded-[14px]" }: { title: string; rounded?: string }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-charcoal bg-gradient-to-br from-charcoal via-[#16140f] to-black ${rounded}`}
    >
      <span className="px-6 text-center font-switzer text-body-sm font-[300] uppercase leading-tight tracking-[0.16em] text-stone/70">
        {title}
      </span>
    </div>
  );
}

function PlayIcon() {
  return (
    <span
      className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-6 w-6">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}

function WallCard({
  item,
  colSpan,
  rowSpan,
  sizes,
  priority,
  index,
  onOpen,
}: {
  item: WallCardItem;
  colSpan: number;
  rowSpan: number;
  sizes: string;
  priority: boolean;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -4% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const posterImage = isImageUrl(item.poster)
    ? item.poster
    : isImageUrl(item.preview)
      ? item.preview
      : null;
  const isPdf = item.kind === "pdf";
  const isLocalVideo = isVideoUrl(item.preview);
  const isPlayable = isYouTube(item.source) || isVimeo(item.source) || isInstagram(item.source);
  // Local mp4 autoplays inline; external platforms load on click (show play icon).
  const showPlayIcon = isPlayable && !isLocalVideo;

  const media = isPdf
    ? <BlurImage src={posterImage || item.preview || ""} alt={item.title} sizes={sizes} priority={priority} />
    : isLocalVideo
      ? <AutoVideo src={item.preview || ""} poster={posterImage} sizes={sizes} />
      : posterImage
        ? <BlurImage src={posterImage} alt={item.title} sizes={sizes} priority={priority} />
        : <DesignedPoster title={item.title} />;

  return (
    <div
      ref={ref}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(26px)",
        transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease",
        transitionDelay: visible ? `${(index % 8) * 45}ms` : "0ms",
        willChange: "transform, opacity",
      }}
    >
      <button
        type="button"
        data-wall-card
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`${item.title} — ${isPdf ? "open deck" : "view project"}`}
        className="group relative block h-full w-full cursor-pointer overflow-hidden rounded-[14px] bg-charcoal text-left outline-none ring-1 ring-white/[0.05] transition-[transform,box-shadow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-gold"
        style={{
          boxShadow: hovered
            ? "0 30px 70px -30px rgba(0,0,0,0.85), 0 0 0 1px rgba(200,162,77,0.22)"
            : "0 10px 30px -24px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
        >
          {media}
        </div>

        {showPlayIcon && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <PlayIcon />
          </div>
        )}

        {/* persistent minimal label */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="font-switzer text-[clamp(14px,1vw,18px)] font-[300] leading-[1.1] text-cinema-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
            {item.title}
          </p>
        </div>

        {/* hover metadata */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/92 via-black/35 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:p-5">
          <div className="mb-3 flex flex-col gap-0.5 text-[10px] font-switzer uppercase tracking-[0.14em] text-cinema-white/70">
            {item.year && <span className="text-gold/80">{item.year}</span>}
            {item.categoryLabel && <span>{item.categoryLabel}</span>}
            {item.client && item.client !== item.title && (
              <span className="text-cinema-white/55">{item.client}</span>
            )}
          </div>
          <h3 className="font-switzer text-[clamp(16px,1.2vw,22px)] font-[300] leading-[1.08] text-cinema-white">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-1 text-caption font-switzer font-[300] text-cinema-white/65">{item.description}</p>
          )}
          {item.agency !== undefined && (
            <div className="mt-2 space-y-0.5 text-[10px] font-switzer uppercase tracking-[0.08em] text-cinema-white/55">
              {item.agency && <p>Agency · {item.agency}</p>}
              {item.role && <p>Role · {item.role}</p>}
              {item.platform && <p>Platform · {item.platform}</p>}
            </div>
          )}
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-switzer uppercase tracking-[0.08em] text-gold/90">
            {isPdf ? "View Deck" : "View Project"}
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}

function Lightbox({ item, onClose }: { item: WallCardItem; onClose: () => void }) {
  const posterImage = isImageUrl(item.poster) ? item.poster : isImageUrl(item.preview) ? item.preview : null;
  let content: ReactNode;
  if (item.preview && isVideoUrl(item.preview)) {
    content = (
      <video
        src={item.preview}
        controls
        autoPlay
        loop
        playsInline
        className="max-h-[88vh] max-w-[95vw] rounded-lg bg-black"
        onError={() => onClose()}
      />
    );
  } else if (isYouTube(item.source)) {
    const u = getYouTubeAutoplayUrl(item.source);
    content = u ? (
      <iframe src={u} title={item.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-[80vh] w-[95vw] max-w-[1400px] rounded-lg border-0 bg-black" />
    ) : null;
  } else if (isVimeo(item.source)) {
    const u = getVimeoEmbedUrl(item.source);
    content = u ? (
      <iframe src={u} title={item.title} allow="autoplay; fullscreen" allowFullScreen className="h-[80vh] w-[95vw] max-w-[1400px] rounded-lg border-0 bg-black" />
    ) : null;
  } else if (posterImage) {
    content = <img src={posterImage} alt={item.title} className="max-h-[88vh] max-w-[95vw] rounded-lg object-contain" />;
  } else {
    content = <div className="rounded-lg bg-charcoal p-10 text-cinema-white">Media unavailable.</div>;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-cinema-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        ×
      </button>
      <div className="mb-4 max-w-[1400px] text-center" onClick={(e) => e.stopPropagation()}>
        <p className="font-switzer text-caption uppercase tracking-[0.16em] text-gold/80">
          {[item.year, item.categoryLabel].filter(Boolean).join(" · ")}
        </p>
        <h3 className="mt-1 font-switzer text-[clamp(18px,2vw,28px)] font-[300] text-cinema-white">{item.title}</h3>
      </div>
      <div onClick={(e) => e.stopPropagation()}>{content}</div>
      {item.source && (
        <a
          href={item.source}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-switzer uppercase tracking-[0.08em] text-gold/90 hover:text-gold"
        >
          View Project
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default function MasonryWall({
  items,
  filters,
  title,
  eyebrow,
  searchPlaceholder = "Search…",
  pdfWall = false,
  hideFilters = false,
}: {
  items: WallCardItem[];
  filters: readonly Filter[];
  title: string;
  eyebrow: string;
  searchPlaceholder?: string;
  pdfWall?: boolean;
  hideFilters?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<WallCardItem | null>(null);

  const rawColumns = useMemo(() => columnsForWidth(width), [width]);
  // PDF wall: exactly 3 cards per row on desktop, 2 on tablet, 1 on mobile.
  const columns = pdfWall
    ? width >= 1024
      ? 3
      : width >= 640
        ? 2
        : 1
    : rawColumns;
  const gap = width > 0 && width < 640 ? 14 : 24;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (active !== "all" && !it.filterKeys.includes(active)) return false;
      if (q) {
        const hay = [it.title, it.client, it.year, it.categoryLabel, it.platform, it.description, ...it.tags]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, active, query]);

  const layout = useMemo(() => {
    const colW = columns > 0 ? (width - (columns - 1) * gap) / columns : 0;
    return filtered.map((it) => {
      const c = colSpanFor(it, columns);
      const w = c * colW + (c - 1) * gap;
      const ar = parseAspect(it.aspect);
      const h = ar > 0 ? w / ar : w;
      const r = Math.max(1, Math.round((h + gap) / (1 + gap)));
      return { it, c, r };
    });
  }, [filtered, width, columns, gap]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of filters) {
      c[f.key] = f.key === "all" ? items.length : items.filter((i) => i.filterKeys.includes(f.key)).length;
    }
    return c;
  }, [items, filters]);

  const open = (item: WallCardItem) => {
    // Videos and PDFs redirect to their original source in a new tab.
    if (
      item.kind === "pdf" ||
      item.kind === "video" ||
      item.kind === "youtube" ||
      item.kind === "instagram" ||
      item.source.includes("vimeo")
    ) {
      window.open(item.source, "_blank", "noopener,noreferrer");
      return;
    }
    setSelected(item);
  };

  const sizesFor = (c: number) =>
    `(max-width:640px) 50vw, (max-width:1024px) 33vw, ${Math.round(100 / Math.max(columns, c))}vw`;

  return (
    <section className="relative w-full bg-cinema-black" style={{ padding: "clamp(56px, 8vw, 120px) 0" }}>
      <div className="mx-auto max-w-[2400px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-switzer text-caption font-[400] uppercase tracking-[0.16em] text-gold/70">{eyebrow}</p>
            <h2
              className="mt-3 font-switzer font-[300] leading-[1] tracking-[-0.03em] text-cinema-white"
              style={{ fontSize: "clamp(34px, 5vw, 72px)" }}
            >
              {title}
            </h2>
          </div>
          <div className="w-full max-w-sm md:w-80">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 transition-colors focus-within:border-gold/60">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="shrink-0 text-stone">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label="Search"
                className="w-full bg-transparent font-switzer text-body-sm text-cinema-white placeholder:text-stone/60 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {!hideFilters && (
          <div className="mb-10 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-caption font-switzer font-[400] uppercase tracking-[0.06em] transition-all duration-300 ${
                  active === f.key
                    ? "border-gold bg-gold text-cinema-black"
                    : "border-white/10 text-stone hover:border-white/30 hover:text-cinema-white"
                }`}
              >
                {f.label}
                <span className={`rounded-full px-1.5 text-[10px] ${active === f.key ? "bg-cinema-black/15 text-cinema-black" : "bg-white/5 text-cinema-white/40"}`}>
                  {counts[f.key] ?? 0}
                </span>
              </button>
            ))}
          </div>
        )}

        {width > 0 ? (
          <div
            ref={containerRef}
            className="relative grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridAutoRows: "1px",
              gridAutoFlow: "row dense",
              gap: `${gap}px`,
            }}
          >
            {layout.map(({ it, c, r }, i) => (
              <WallCard
                key={it.id}
                item={it}
                colSpan={c}
                rowSpan={r}
                sizes={sizesFor(c)}
                priority={i < columns * 2}
                index={i}
                onOpen={() => open(it)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-24 text-center font-switzer text-body text-stone">
                Nothing here yet.
              </p>
            )}
          </div>
        ) : (
          <div ref={containerRef} className="min-h-[60vh]" />
        )}
      </div>

      {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
