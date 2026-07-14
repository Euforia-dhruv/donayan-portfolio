"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import wallItemsRaw from "@/lib/wall-items.json";
import type { WallItem } from "@/types/wall";
import WallVideo from "@/components/WallVideo";
import WallGallery from "@/components/WallGallery";

const wallItems = wallItemsRaw as WallItem[];

const FILTER_ORDER = [
  "All",
  "Commercials",
  "Brand Films",
  "Fashion Films",
  "Campaigns",
  "Reels",
  "Posts",
  "Collaborations",
  "Videos",
  "Images",
  "Music Videos",
  "Print",
];

const GAP = 16;

export default function ProductionWall({
  titleAs = "h2",
}: {
  titleAs?: "h1" | "h2";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("All");
  const [gallery, setGallery] = useState<WallItem | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.04 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Measure the grid width so we can lay out a true masonry (column count +
  // per-card row span derived from each media's real aspect ratio).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Filters are generated dynamically from the data.
  const filters = useMemo(() => {
    const set = new Set<string>();
    wallItems.forEach((it) => it.filters.forEach((f) => set.add(f)));
    return [...set].sort((a, b) => {
      const ia = FILTER_ORDER.indexOf(a);
      const ib = FILTER_ORDER.indexOf(b);
      return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
    });
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    filters.forEach((f) => {
      c[f] = f === "All"
        ? wallItems.length
        : wallItems.filter((it) => it.filters.includes(f)).length;
    });
    return c;
  }, [filters]);

  const filtered = useMemo(
    () =>
      active === "All"
        ? wallItems
        : wallItems.filter((it) => it.filters.includes(active)),
    [active],
  );

  // ---- True masonry layout ------------------------------------------------
  // Column count responds to the container width (not the viewport) so the
  // wall stays balanced at every breakpoint.
  const cols = width >= 1024 ? 4 : width >= 640 ? 3 : 2;

  const parseAspect = (a: string): number => {
    const [w, h] = a.split("/").map((n) => parseFloat(n.trim()));
    return h ? w / h : 1;
  };

  // Landscape media spans two columns so it reads as a large cinematic tile
  // (equal visual weight to a tall portrait), like an Awwwards / Cargo wall.
  const layout = useMemo(() => {
    if (width === 0) return [];
    const colW = (width - (cols - 1) * GAP) / cols;
    return filtered.map((it) => {
      const ar = parseAspect(it.aspect);
      const landscape = ar > 1.1;
      const colSpan = landscape ? Math.min(2, cols) : 1;
      const itemW = colSpan * colW + (colSpan - 1) * GAP;
      const h = itemW / ar;
      const rowSpan = Math.max(1, Math.round((h + GAP) / (1 + GAP)));
      return { it, colSpan, rowSpan };
    });
  }, [filtered, width, cols]);

  const sizesFor = (colSpan: number) => {
    const pct = Math.round((100 * colSpan) / cols);
    return `(max-width:640px) ${colSpan > 1 ? "100vw" : "50vw"}, (max-width:1024px) ${colSpan > 1 ? "100vw" : "33vw"}, ${pct}vw`;
  };

  const open = (it: WallItem) => {
    // Grouped projects open an in-app gallery so every image can be browsed.
    if (it.grouping) {
      setGallery(it);
      return;
    }
    // Every other card opens the ORIGINAL SOURCE (never the local asset).
    window.open(it.source, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="wall"
      ref={sectionRef}
      className="relative w-full bg-cinema-black"
      style={{ padding: "clamp(40px, 6vw, 80px) 0" }}
      aria-label="Production Wall"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.03,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 text-center md:mb-14">
          <p className="font-switzer text-caption font-[400] uppercase tracking-[0.12em] text-stone">
            The Moodboard
          </p>
          {titleAs === "h1" ? (
            <h1
              className="mt-3 font-switzer font-[300] leading-[1] tracking-[-0.03em]"
              style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}
            >
              The Wall
            </h1>
          ) : (
            <h2
              className="mt-3 font-switzer font-[300] leading-[1] tracking-[-0.03em]"
              style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}
            >
              The Wall
            </h2>
          )}
          <p className="mt-2 font-switzer text-caption font-[400] text-stone/60">
            {wallItems.length} selected works · click to view the original
          </p>
        </div>

        {/* Filters — generated from the data, counts update automatically. */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {filters.map((f) => {
            const on = f === active;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={on}
                className={`rounded-full border px-4 py-2 font-switzer text-caption uppercase tracking-[0.06em] transition-colors ${
                  on
                    ? "border-gold bg-gold text-cinema-black"
                    : "border-white/15 text-cinema-white/70 hover:border-gold/50 hover:text-cinema-white"
                }`}
              >
                {f}
                <span className={on ? "ml-1.5 opacity-70" : "ml-1.5 text-gold/70"}>
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Masonry wall — CSS grid. Every card keeps its media's real aspect
            ratio; landscape cards span two columns for equal visual weight. */}
        <div ref={containerRef}>
          {width === 0 ? (
            <div className="min-h-[60vh]" />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridAutoRows: "1px",
                gridAutoFlow: "row dense",
                gap: `${GAP}px`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              {layout.map(({ it, colSpan, rowSpan }, i) => {
                const isVideo = it.kind === "video";
                return (
                  <div
                    key={it.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => open(it)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        open(it);
                      }
                    }}
                    className="group relative block w-full overflow-hidden rounded-2xl bg-charcoal text-left outline-none transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)] focus-visible:ring-2 focus-visible:ring-gold"
                    style={{
                      gridColumn: `span ${colSpan}`,
                      gridRow: `span ${rowSpan}`,
                      animation: visible
                        ? `cardEntrance 0.6s ease ${0.02 + i * 0.03}s forwards`
                        : "none",
                      opacity: visible ? undefined : 0,
                    }}
                    aria-label={`${it.title} — view project`}
                  >
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                      {isVideo ? (
                        <WallVideo src={it.cover} sizes={sizesFor(colSpan)} />
                      ) : (
                        <Image
                          src={it.cover}
                          alt={it.title}
                          fill
                          sizes={sizesFor(colSpan)}
                          className="object-cover"
                          priority={i < 6}
                        />
                      )}
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="font-switzer text-[10px] font-[400] uppercase tracking-[0.1em] text-gold/75">
                        {it.category}
                        {it.year ? ` · ${it.year}` : ""}
                      </p>
                      <p className="mt-0.5 font-switzer text-caption font-[400] leading-tight text-cinema-white">
                        {it.title}
                      </p>
                      {it.description && (
                        <p className="mt-1 line-clamp-3 font-switzer text-[11px] font-[300] leading-snug text-cinema-white/70">
                          {it.description}
                        </p>
                      )}
                      <span className="mt-1 inline-block text-[10px] font-switzer uppercase tracking-[0.1em] text-gold/80">
                        {it.grouping ? "View Gallery →" : "View Project →"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {gallery && <WallGallery item={gallery} onClose={() => setGallery(null)} />}
    </section>
  );
}
