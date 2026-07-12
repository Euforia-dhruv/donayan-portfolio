"use client";

import { useEffect, useRef, useState } from "react";
import type { ArchiveEntry } from "@/lib/types";

// Deterministic seeded random
function seededRand(n: number): number {
  const x = Math.sin(n * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

interface WallCard {
  entry: ArchiveEntry;
  w: number;
  h: number;
  x: number;
  y: number;
  rot: number;
  z: number;
}

const SIZE_POOL: { w: number; h: number; label: string }[] = [
  { w: 180, h: 240, label: "xs-portrait" },
  { w: 240, h: 180, label: "xs-landscape" },
  { w: 200, h: 200, label: "xs-square" },
  { w: 240, h: 320, label: "s-portrait" },
  { w: 320, h: 240, label: "s-landscape" },
  { w: 260, h: 260, label: "s-square" },
  { w: 300, h: 400, label: "m-portrait" },
  { w: 400, h: 300, label: "m-landscape" },
  { w: 340, h: 340, label: "m-square" },
  { w: 360, h: 480, label: "l-portrait" },
  { w: 480, h: 360, label: "l-landscape" },
  { w: 420, h: 420, label: "l-square" },
  { w: 500, h: 360, label: "xl-landscape" },
  { w: 360, h: 500, label: "xl-portrait" },
];

const CANVAS_W = 1600;
const COL_COUNT = 6;
const COL_W = CANVAS_W / COL_COUNT;

function buildLayout(entries: ArchiveEntry[]): WallCard[] {
  const colHeights = new Array(COL_COUNT).fill(40); // top padding
  const cards: WallCard[] = [];

  // Sort by ID so layout is deterministic
  const sorted = [...entries].sort((a, b) => a.id - b.id);

  for (const entry of sorted) {
    const seed = entry.id * 7 + 13;
    const sizeIdx = Math.floor(seededRand(seed) * SIZE_POOL.length);
    const size = SIZE_POOL[sizeIdx];
    const colSpan = Math.max(1, Math.round(size.w / COL_W));
    const actualW = colSpan * COL_W - 12;

    // Aspect-ratio-aware height
    let actualH = size.h;
    if (entry.video) {
      // 16:9 base
      actualH = Math.round(actualW * 0.5625);
    } else if (entry.images.length > 0) {
      actualH = Math.round(actualW * 0.75);
    }

    // Find best column (lowest height that fits colSpan)
    let bestCol = 0;
    let bestH = Infinity;
    for (let c = 0; c <= COL_COUNT - colSpan; c++) {
      const h = Math.max(...colHeights.slice(c, c + colSpan));
      if (h < bestH) {
        bestH = h;
        bestCol = c;
      }
    }

    const xOff = seededRand(seed + 1) * 20 - 10;
    const yOff = seededRand(seed + 2) * 16 - 8;
    const rot = (seededRand(seed + 3) * 6 - 3);
    const z = Math.floor(seededRand(seed + 4) * 100) + 10;

    const cardX = bestCol * COL_W + xOff;
    const cardY = bestH + yOff;

    cards.push({
      entry,
      w: actualW,
      h: actualH,
      x: cardX,
      y: cardY,
      rot,
      z,
    });

    // Update column heights
    const cardBottom = cardY + actualH + 20;
    for (let c = bestCol; c < bestCol + colSpan; c++) {
      colHeights[c] = cardBottom;
    }
  }

  return cards;
}

function WallCard({ card }: { card: WallCard }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const hasVideo = !!card.entry.video;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (e.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute cursor-pointer overflow-hidden"
      style={{
        left: `${(card.x / CANVAS_W) * 100}%`,
        top: card.y,
        width: card.w,
        height: card.h,
        zIndex: hovered ? 999 : card.z,
        borderRadius: "14px",
        transform: `rotate(${card.rot}deg)`,
        boxShadow: hovered
          ? "0 24px 72px rgba(0,0,0,0.7)"
          : "0 6px 24px rgba(0,0,0,0.45)",
        transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s ease, z-index 0s",
        filter: hovered ? "brightness(1.1)" : "brightness(0.95)",
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        e.currentTarget.style.transform = `rotate(${card.rot}deg) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.transform = `rotate(${card.rot}deg)`;
      }}
      onClick={() => { if (card.entry.url) window.open(card.entry.url, "_blank"); }}
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          src={`/assets/videos/${card.entry.video}`}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
      ) : card.entry.images.length > 0 ? (
        card.entry.images.length === 1 ? (
          <img
            src={`/assets/videos/${card.entry.images[0]}`}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid" style={{ gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "2px" }}>
            <img src={`/assets/videos/${card.entry.images[0]}`} alt="" className="w-full h-full object-cover" style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }} />
            {card.entry.images.slice(1, 5).map((img, j) => (
              <img key={j} src={`/assets/videos/${img}`} alt="" className="w-full h-full object-cover" />
            ))}
          </div>
        )
      ) : (
        <div className="w-full h-full" style={{ backgroundColor: "#1E1E1E" }} />
      )}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "14px",
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* ID badge */}
      <div
        className="absolute top-2.5 left-3 pointer-events-none"
        style={{
          fontSize: "9px",
          fontFamily: "var(--font-switzer, Inter, sans-serif)",
          fontWeight: 400,
          letterSpacing: "0.06em",
          color: "rgba(245,245,242,0.2)",
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
        }}
      >
        #{card.entry.id}
      </div>

      {/* Title on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none px-3.5 pb-3"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <p className="text-xs font-switzer font-[400]" style={{ color: "rgba(245,245,242,0.85)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
          {card.entry.title}
        </p>
      </div>
    </div>
  );
}

export default function ProductionWall() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/assets/archive/archive.json")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data);
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      })
      .catch(() => {});
  }, []);

  const layout = entries.length > 0 ? buildLayout(entries) : [];
  const maxH = layout.reduce((m, c) => Math.max(m, c.y + c.h + 60), 600);

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{
        backgroundColor: "#0b0b0b",
        paddingTop: "120px",
        paddingBottom: "80px",
        minHeight: maxH,
      }}
    >
      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.035,
        }}
      />

      {/* Header */}
      <div className="relative z-10 text-center mb-12 pointer-events-none">
        <p
          className="text-xs font-switzer font-[400] uppercase tracking-[0.1em]"
          style={{ color: "rgba(245,245,242,0.35)" }}
        >
          Production Wall
        </p>
        <h2
          className="font-switzer font-[300] leading-[1] tracking-[-0.04em] mt-3"
          style={{ fontSize: "clamp(36px, 5vw, 72px)", color: "#F5F5F2" }}
        >
          The Wall
        </h2>
      </div>

      {/* Canvas */}
      <div
        className="relative mx-auto"
        style={{
          width: "100%",
          maxWidth: `${CANVAS_W}px`,
          height: maxH,
        }}
      >
        {layout.map((card) => (
          <div
            key={card.entry.id}
            style={{
              opacity: 0,
              animation: visible
                ? `cardEntrance 0.8s ease-out ${Math.min(card.entry.id * 0.04, 1.5)}s forwards`
                : "none",
            }}
          >
            <WallCard card={card} />
          </div>
        ))}
      </div>
    </section>
  );
}
