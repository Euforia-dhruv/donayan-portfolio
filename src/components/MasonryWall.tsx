"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import WallVideo from "@/components/WallVideo";
import {
  parseAspect,
  type WallCardItem,
} from "@/lib/wall-items";

interface Filter {
  key: string;
  label: string;
}

function spanFor(item: WallCardItem, columns: number): number {
  if (columns < 3) return 1;
  const ar = parseAspect(item.aspect);
  if (item.kind === "video" || item.kind === "youtube") return ar >= 1.4 ? 2 : 1;
  if (item.kind === "image") return ar >= 1.4 ? 2 : 1;
  if (item.kind === "pdf") {
    // deterministic editorial rhythm: ~1 in 4 docs becomes a feature tile
    let h = 0;
    for (let i = 0; i < item.id.length; i++) h = (h * 31 + item.id.charCodeAt(i)) | 0;
    return Math.abs(h) % 4 === 0 ? 2 : 1;
  }
  return ar >= 1.4 ? 2 : 1;
}

function columnsForWidth(w: number): number {
  if (w === 0) return 3;
  if (w < 640) return 2;
  if (w < 1024) return 3;
  if (w < 1500) return 4;
  if (w < 1900) return 5;
  if (w < 2300) return 6;
  return 7;
}

function WallCard({
  item,
  x,
  y,
  w,
  h,
  index,
  priority,
  onOpen,
}: {
  item: WallCardItem;
  x: number;
  y: number;
  w: number;
  h: number;
  index: number;
  priority: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgReady, setImgReady] = useState(false);

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
      { threshold: 0.06, rootMargin: "0px 0px -4% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isCampaign =
    item.filterKeys.includes("campaigns") ||
    item.agency !== undefined;

  const media = (() => {
    if (item.kind === "video") {
      return (
        <WallVideo src={item.preview || ""} poster={item.poster} hovered={hovered} priority={priority} />
      );
    }
    if (item.kind === "youtube" || item.kind === "instagram") {
      return item.poster ? (
        <>
          <Image
            src={item.poster}
            alt={item.title}
            fill
            sizes={`${Math.round(w)}px`}
            priority={priority}
            className="object-cover"
            onLoad={() => setImgReady(true)}
            onError={() => setImgReady(true)}
          />
          {!imgReady && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-charcoal to-black" />}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-6 w-6"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-black" />
      );
    }
    // image / pdf
    return item.preview ? (
      <>
        <Image
          src={item.preview}
          alt={item.title}
          fill
          sizes={`${Math.round(w)}px`}
          priority={priority}
          className={`object-cover transition-[opacity,transform] duration-700 ${imgReady ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgReady(true)}
          onError={() => setImgReady(true)}
        />
        {!imgReady && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-charcoal to-black" />}
      </>
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-black" />
    );
  })();

  return (
    <div
      ref={ref}
      className="group absolute"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) translateY(${visible ? 0 : 26}px)`,
        width: w,
        height: h,
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease",
        transitionDelay: visible ? `${(index % 8) * 45}ms` : "0ms",
        willChange: "transform, opacity",
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        aria-label={`${item.title} — open`}
        className="relative block h-full w-full cursor-pointer overflow-hidden rounded-[14px] bg-charcoal text-left outline-none ring-1 ring-white/[0.06] transition-[transform,box-shadow] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-gold"
        style={{
          boxShadow: hovered
            ? "0 30px 70px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,162,77,0.22)"
            : "0 10px 30px -24px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transform: hovered ? "scale(1.045)" : "scale(1)" }}
        >
          {media}
        </div>

        {/* persistent minimal label */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="font-switzer text-[clamp(14px,1vw,18px)] font-[300] leading-[1.1] text-cinema-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            {item.title}
          </p>
        </div>

        {/* hover metadata */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:p-5"
        >
          <div className="mb-3 flex flex-col gap-0.5 text-[10px] font-switzer uppercase tracking-[0.14em] text-cinema-white/70">
            {item.year && <span className="text-gold/80">{item.year}</span>}
            {item.categoryLabel && <span>{item.categoryLabel}</span>}
            {item.client && item.client !== item.title && <span className="text-cinema-white/55">{item.client}</span>}
          </div>
          <h3 className="font-switzer text-[clamp(16px,1.2vw,22px)] font-[300] leading-[1.08] text-cinema-white">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-1 text-caption font-switzer font-[300] text-cinema-white/60">{item.description}</p>
          )}
          {isCampaign && (
            <div className="mt-2 space-y-0.5 text-[10px] font-switzer uppercase tracking-[0.08em] text-cinema-white/55">
              {item.agency && <p>Agency · {item.agency}</p>}
              {item.role && <p>Role · {item.role}</p>}
              {item.platform && <p>Platform · {item.platform}</p>}
            </div>
          )}
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-switzer uppercase tracking-[0.08em] text-gold/90">
            View Project
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function MasonryWall({
  items,
  filters,
  title,
  eyebrow,
  searchPlaceholder = "Search…",
}: {
  items: WallCardItem[];
  filters: readonly Filter[];
  title: string;
  eyebrow: string;
  searchPlaceholder?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState("all");
  const [query, setQuery] = useState("");

  const columns = useMemo(() => columnsForWidth(width), [width]);
  const gutter = width > 0 && width < 640 ? 16 : 24;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (active !== "all" && !it.filterKeys.includes(active)) return false;
      if (q) {
        const hay = [it.title, it.client, it.year, it.categoryLabel, it.platform, ...it.tags]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, active, query]);

  const { placed, height } = useMemo(() => {
    if (!width) return { placed: [] as Array<{ item: WallCardItem; x: number; y: number; w: number; h: number }>, height: 0 };
    const colW = (width - (columns - 1) * gutter) / columns;
    const colH = new Array(columns).fill(0);
    const out: Array<{ item: WallCardItem; x: number; y: number; w: number; h: number }> = [];
    filtered.forEach((it) => {
      let span = Math.min(spanFor(it, columns), columns);
      let bestC = 0;
      let bestH = Infinity;
      for (let c = 0; c <= columns - span; c++) {
        let m = 0;
        for (let k = 0; k < span; k++) m = Math.max(m, colH[c + k]);
        if (m < bestH) {
          bestH = m;
          bestC = c;
        }
      }
      const x = bestC * (colW + gutter);
      const y = bestH;
      const w = span * colW + (span - 1) * gutter;
      const h = w / parseAspect(it.aspect);
      out.push({ item: it, x, y, w, h });
      for (let k = 0; k < span; k++) colH[bestC + k] = y + h + gutter;
    });
    return { placed: out, height: Math.max(0, ...colH) };
  }, [filtered, width, columns, gutter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of filters) {
      c[f.key] = f.key === "all" ? items.length : items.filter((i) => i.filterKeys.includes(f.key)).length;
    }
    return c;
  }, [items, filters]);

  return (
    <section className="relative w-full bg-cinema-black" style={{ padding: "clamp(56px, 8vw, 120px) 0" }}>
      <div className="mx-auto max-w-[2400px] px-4 sm:px-6 lg:px-10">
        {/* header */}
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="shrink-0 text-stone"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
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

        {/* filters */}
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

        {/* masonry */}
        <div ref={containerRef} className="relative w-full" style={{ height }}>
          {placed.map((p, i) => (
            <WallCard
              key={p.item.id}
              item={p.item}
              x={p.x}
              y={p.y}
              w={p.w}
              h={p.h}
              index={i}
              priority={p.y < 760}
              onOpen={() => window.open(p.item.source, "_blank", "noopener,noreferrer")}
            />
          ))}
          {placed.length === 0 && (
            <p className="py-24 text-center font-switzer text-body text-stone">Nothing here yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
