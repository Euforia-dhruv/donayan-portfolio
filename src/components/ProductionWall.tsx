"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import wallItemsRaw from "@/lib/wall-items.json";
import type { WallItem } from "@/types/wall";
import WallVideo from "@/components/WallVideo";
import WallModal from "@/components/WallModal";

const wallItems = wallItemsRaw as WallItem[];

const GAP = 16;

// Masonry column counts by container width (not viewport) so the wall stays
// balanced at every breakpoint: desktop 5, laptop 4, tablet 3, mobile 2.
function columnsForWidth(w: number): number {
  if (w >= 1536) return 5;
  if (w >= 1024) return 4;
  if (w >= 640) return 3;
  return 2;
}

const parseAspect = (a: string): number => {
  const [w, h] = a.split("/").map((n) => parseFloat(n.trim()));
  return h ? w / h : 1;
};

/**
 * A "premium" video is a landscape film (16:9-ish) — YouTube features, not
 * vertical shorts. These become featured hero pieces: 2 columns wide, native
 * 16:9 (no crop, no letterbox). Detection is automatic from the media kind
 * and aspect ratio, so adding a landscape clip to the wall just works.
 */
function isPremiumVideo(it: WallItem): boolean {
  if (it.kind !== "video") return false;
  const ar = parseAspect(it.aspect);
  const isShort = /shorts/.test(it.source || "");
  return !isShort && ar >= 1.4;
}

export default function ProductionWall({
  titleAs = "h2",
}: {
  titleAs?: "h1" | "h2";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState<WallItem | null>(null);
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

  // Measure the grid width so we can lay out a true masonry where every card
  // keeps its media's real aspect ratio (no crop, no letterbox).
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

  const cols = columnsForWidth(width);

  const sizesFor = (colSpan: number) =>
    colSpan >= 2
      ? "(max-width:640px) 100vw, (max-width:1024px) 66vw, 40vw"
      : "(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw";

  // Lay out the wall as a dense CSS grid (1px auto-rows). Each card spans a
  // column/row count derived from its real aspect ratio, so media is never
  // cropped or letterboxed and large videos are evenly distributed.
  const layout = useMemo(() => {
    if (width === 0 || cols === 0) return [] as { it: WallItem; colSpan: number; rowSpan: number; premium: boolean; index: number }[];

    // Evenly distribute premium videos so they don't cluster and the masonry
    // stays balanced (large heroes spaced through the grid).
    const prem = wallItems.filter(isPremiumVideo);
    const rest = wallItems.filter((it) => !isPremiumVideo(it));
    const total = wallItems.length;
    const ordered: WallItem[] = [];
    if (prem.length > 0) {
      const step = total / (prem.length + 1);
      const slots = new Set<number>();
      for (let i = 0; i < prem.length; i++) {
        slots.add(Math.min(total - 1, Math.max(0, Math.round(step * (i + 1)))));
      }
      let pi = 0;
      let ri = 0;
      for (let i = 0; i < total; i++) {
        if (slots.has(i) && pi < prem.length) ordered.push(prem[pi++]);
        else ordered.push(rest[ri++]);
      }
    } else {
      ordered.push(...wallItems);
    }

    const colW = (width - (cols - 1) * GAP) / cols;
    return ordered.map((it, i) => {
      const ar = parseAspect(it.aspect);
      const premium = isPremiumVideo(it);
      // Premium (landscape) videos span 2 columns whenever the grid has room —
      // that's full width on mobile (2 cols) and 2 of N on larger screens.
      const colSpan = premium ? 2 : 1;
      const cardW = colSpan * colW + (colSpan - 1) * GAP;
      const cardH = cardW / ar;
      const rowSpan = Math.max(1, Math.round((cardH + GAP) / (1 + GAP)));
      return { it, colSpan, rowSpan, premium, index: i };
    });
  }, [width, cols]);

  const open = (it: WallItem) => setModal(it);

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
        <div className="mb-12 text-center md:mb-16">
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
            {wallItems.length} selected works · select to explore
          </p>
        </div>

        {/* True masonry — each card is edge-to-edge media, no overlay text by
            default. Aspect ratios are preserved exactly so nothing is cropped
            or letterboxed. Landscape videos become 2-column hero pieces. */}
        <div ref={containerRef}>
          {width === 0 ? (
            <div className="min-h-[60vh]" />
          ) : (
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridAutoRows: "1px",
                gridAutoFlow: "row dense",
                gap: `${GAP}px`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease, transform 0.7s ease",
              }}
            >
              {layout.map(({ it, colSpan, rowSpan, premium, index }) => {
                const isVideo = it.kind === "video";
                const priority = index < cols * 2;
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
                    aria-label={it.title}
                    className={`group relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-charcoal outline-none transition-shadow duration-[250ms] ease-out hover:shadow-[0_22px_60px_-24px_rgba(0,0,0,0.75)] focus-visible:ring-2 focus-visible:ring-gold ${
                      premium
                        ? "ring-1 ring-white/[0.06] hover:ring-gold/30"
                        : ""
                    }`}
                    style={{
                      gridColumn: `span ${colSpan}`,
                      gridRow: `span ${rowSpan}`,
                      animation: visible
                        ? `cardEntrance 0.7s ease ${0.03 + index * 0.03}s forwards`
                        : "none",
                      opacity: visible ? undefined : 0,
                    }}
                  >
                    <div className="absolute inset-0 transition-transform duration-[250ms] ease-out group-hover:scale-[1.02]">
                      {isVideo ? (
                        <WallVideo src={it.cover} sizes={sizesFor(colSpan)} />
                      ) : (
                        <Image
                          src={it.cover}
                          alt={it.title}
                          fill
                          sizes={sizesFor(colSpan)}
                          className="object-cover"
                          priority={priority}
                          loading={priority ? "eager" : "lazy"}
                        />
                      )}
                    </div>

                    {premium && (
                      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-switzer uppercase tracking-[0.14em] text-cinema-white/90 backdrop-blur-sm">
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Film
                      </span>
                    )}

                    {/* Hover only: subtle dark fade (<=20%) + title + arrow. */}
                    <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-[250ms] ease-out group-hover:bg-black/20 group-focus-visible:bg-black/20" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-[250ms] ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
                      <p className="font-switzer text-caption font-[400] leading-tight text-cinema-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                        {it.title}
                      </p>
                      <svg
                        className="shrink-0 text-cinema-white"
                        width="16"
                        height="16"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 7h8M11 7L7 3M11 7L7 11"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modal && <WallModal item={modal} onClose={() => setModal(null)} />}
    </section>
  );
}
