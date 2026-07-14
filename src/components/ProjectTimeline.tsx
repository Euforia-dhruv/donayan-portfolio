"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import wallItemsRaw from "@/lib/wall-items.json";
import type { WallItem } from "@/types/wall";
import WallVideo from "@/components/WallVideo";

const ALL = wallItemsRaw as WallItem[];

const CURRENT_YEAR = new Date().getFullYear();

/** Pull a brand/client name out of a project title ("Centrum × Kajal — …" → "Centrum"). */
function deriveBrand(title: string): string {
  const t = (title || "").trim();
  const idx = t.search(/[×—–\-]/);
  if (idx > 0) return t.slice(0, idx).trim();
  return t;
}

function sourceLabel(source: string): string {
  if (source.includes("youtube")) return "Watch on YouTube";
  if (source.includes("instagram")) return "View on Instagram";
  if (source.includes("vimeo")) return "Watch on Vimeo";
  return "View Project";
}

interface YearGroup {
  year: string;
  items: WallItem[];
}

/* ------------------------------------------------------------------ */
/* Timeline card                                                       */
/* ------------------------------------------------------------------ */
function TimelineCard({ item, index }: { item: WallItem; index: number }) {
  const isVideo = item.kind === "video";
  const brand = deriveBrand(item.title);
  const sizes =
    "(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw";

  return (
    <a
      href={item.source}
      target="_blank"
      rel="noopener noreferrer"
      data-tl-card
      aria-label={`${item.title} — ${sourceLabel(item.source)}`}
      className="tl-card group relative block overflow-hidden rounded-2xl bg-charcoal text-left ring-1 ring-white/[0.06] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_28px_70px_-30px_rgba(0,0,0,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      style={{ transitionDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
        {/* Inner wrapper is slightly taller than the frame so the media can
            parallax a few px without revealing an edge. */}
        <div className="tl-media-inner absolute inset-x-0 -inset-y-[7%] will-change-transform">
          {isVideo ? (
            <WallVideo src={item.cover} sizes={sizes} />
          ) : (
            <Image
              src={item.cover}
              alt={item.title}
              fill
              sizes={sizes}
              loading="lazy"
              className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
        <span className="pointer-events-none absolute bottom-3 right-3 translate-y-1 text-[10px] font-switzer uppercase tracking-[0.12em] text-gold/80 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {sourceLabel(item.source)} →
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-switzer uppercase tracking-[0.12em] text-gold/70">
          {brand && <span>{brand}</span>}
          {brand && item.category && <span className="text-cinema-white/25">·</span>}
          {item.category && <span className="text-cinema-white/55">{item.category}</span>}
        </div>
        <h3 className="mt-1.5 font-switzer text-body-sm font-[300] leading-[1.15] text-cinema-white">
          {item.title}
        </h3>
        {item.description && (
          <p className="mt-1.5 line-clamp-2 font-switzer text-caption font-[300] leading-snug text-stone/70">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function ProjectTimeline({
  titleAs = "h2",
}: {
  titleAs?: "h1" | "h2";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Group + sort: years newest → oldest, "Unknown" year last, items by number.
  const groups = useMemo<YearGroup[]>(() => {
    const map = new Map<string, WallItem[]>();
    for (const it of ALL) {
      const y = (it.year || "").trim();
      const key = y || "Unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    const keys = [...map.keys()].sort((a, b) => {
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return Number(b) - Number(a);
    });
    return keys.map((year) => ({
      year,
      items: map
        .get(year)!
        .slice()
        .sort((x, y) => (x.number || 0) - (y.number || 0)),
    }));
  }, []);

  const latestYear = groups[0]?.year;

  // Reveal cards once (animate only once) + grow the spine + subtle parallax.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-tl-card]")
    );

    const revealObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("visible");
            revealObs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    cards.forEach((c) => revealObs.observe(c));

    const update = () => {
      rafRef.current = null;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // Spine progress: grows from when the section top hits the middle of the
      // viewport until its bottom passes the middle.
      const total = rect.height;
      const scrolled = Math.min(Math.max(vh * 0.5 - rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
      }
      // Parallax: nudge each in-view card's media a few px based on its
      // distance from the viewport centre. Cheap + GPU-friendly.
      const centre = vh / 2;
      for (const c of cards) {
        const m = c.querySelector<HTMLElement>(".tl-media-inner");
        if (!m) continue;
        const r = c.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const cardCentre = r.top + r.height / 2;
        const shift = Math.max(-14, Math.min(14, (cardCentre - centre) * -0.04));
        m.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      revealObs.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const rail = "left-[18px] md:left-[30px]";

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative overflow-hidden bg-cinema-black py-20 md:py-28"
      aria-label="Production Timeline"
    >
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(200,162,77,0.07), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-10">
        <p className="font-switzer text-caption font-[400] uppercase tracking-[0.12em] text-gold/80">
          Career
        </p>
        {titleAs === "h1" ? (
          <h1 className="mt-3 max-w-3xl font-switzer font-[300] leading-[1] tracking-[-0.03em] text-cinema-white text-heading md:text-heading-lg">
            Production Timeline
          </h1>
        ) : (
          <h2 className="mt-3 max-w-3xl font-switzer font-[300] leading-[1] tracking-[-0.03em] text-cinema-white text-heading md:text-heading-lg">
            Production Timeline
          </h2>
        )}
        <p className="mt-4 max-w-xl font-switzer text-body-sm font-[300] leading-[1.55] text-stone">
          A chronological look at selected commercials, brand films, campaigns and
          collaborations — newest first. Tap any project to view the original.
        </p>

        <div className="relative mt-14 md:mt-20">
          {/* spine — track + animated gold fill */}
          <div
            className={`absolute ${rail} top-1 bottom-1 w-px bg-white/10`}
            aria-hidden="true"
          />
          <div
            ref={fillRef}
            className={`absolute ${rail} top-1 w-px origin-top bg-gold`}
            style={{ height: "calc(100% - 0.5rem)", transform: "scaleY(0)" }}
            aria-hidden="true"
          />

          <div className="space-y-14 md:space-y-20">
            {groups.map((group) => {
              const glow = group.year === String(CURRENT_YEAR) || group.year === latestYear;
              return (
                <div key={group.year} className="relative pl-12 md:pl-[88px]">
                  {/* year badge sits on the spine */}
                  <div
                    className={`tl-year-badge absolute top-0 ${rail} z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/15 bg-cinema-black font-switzer text-caption font-[500] text-cinema-white md:h-12 md:w-12 md:text-body-sm`}
                    data-glow={glow ? "true" : "false"}
                    aria-hidden="true"
                  >
                    {group.year}
                  </div>

                  <div className="mb-5 font-switzer text-caption font-[400] uppercase tracking-[0.14em] text-stone/70 md:hidden">
                    {group.year}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((it, i) => (
                      <TimelineCard key={it.id} item={it} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
