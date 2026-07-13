"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { getMediaUrl } from "@/lib/media";
import archive from "@/data/archive.json";
import videoEntries from "@/data/video-entries.json";
import { getYouTubeThumbnail, getYouTubeId } from "@/lib/video-utils";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface WallItem {
  id: string;
  label: string;
  src: string;
  pdf?: string;
  externalUrl?: string;
  w: number;
  h: number;
  isVideo?: boolean;
  videoUrl?: string;
}

interface CardPos {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
}

/* ------------------------------------------------------------------ */
/*  Seeded PRNG                                                       */
/* ------------------------------------------------------------------ */

function seedRng(seed: number) {
  let s = Math.abs(seed) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ------------------------------------------------------------------ */
/*  AABB overlap test                                                  */
/* ------------------------------------------------------------------ */

function overlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number, gap: number,
) {
  return ax - gap < bx + bw && ax + aw + gap > bx
      && ay - gap < by + bh && ay + ah + gap > by;
}

/* ------------------------------------------------------------------ */
/*  Wall-card source data + lookup utilities                          */
/* ------------------------------------------------------------------ */

const WALL_SRC: { id: string; label: string; src: string; pdf: string | null; w: number; h: number }[] = [
  { id: "w-centrum",    label: "Centrum",          src: "/ppm-decks/Centrum.png",           pdf: null,                                                    w: 400, h: 225 },
  { id: "w-hdfc",       label: "HDFC KVS",         src: "/ppm-decks/HDFC.png",              pdf: "/PPM Decks/HDFC KVS Post PPM Deck.pdf",                 w: 440, h: 248 },
  { id: "w-murgi-2",    label: "Murgi",            src: "/movie-ott-pitches/Murgi 1.png",   pdf: "/Movie - OTT pitches/Murgi.pdf",                        w: 185, h: 329 },
  { id: "w-ponds",      label: "Ponds BB Cream",   src: "/treatment-notes/ponds.png",       pdf: "/Treatment Notes/Ponds  BB cream TN.pdf",               w: 420, h: 236 },
  { id: "w-justbe",     label: "Just Be",          src: "/marketing-pitch/Just be.png",     pdf: "/Marketing Pitch/Just Be.pdf",                          w: 360, h: 203 },
  { id: "w-tanishq",    label: "Tanishq",           src: "/others/Tanishq.png",             pdf: "/Others/Tanishq Casting.pdf",                           w: 220, h: 293 },
  { id: "w-sprite",     label: "Sprite",           src: "/ppm-decks/Sprite.png",            pdf: null,                                                    w: 340, h: 255 },
  { id: "w-idee",       label: "IDEE",             src: "/ppm-decks/IDEE.png",              pdf: "/PPM Decks/IDEE PPM.pdf",                              w: 360, h: 270 },
  { id: "w-godrej",     label: "Godrej Capital",   src: "/treatment-notes/godrej.png",      pdf: "/Treatment Notes/Godrej Capital - Director_s Note.pdf", w: 340, h: 255 },
  { id: "w-oool",       label: "OOOL Digital",     src: "/marketing-pitch/oool.png",        pdf: "/Marketing Pitch/OOOL Digital Strategy.pdf",            w: 340, h: 255 },
  { id: "w-ax",         label: "AX",               src: "/ppm-decks/AX.png",                pdf: "/PPM Decks/AX Celebrity Shoot SS_25.pdf",               w: 230, h: 288 },
  { id: "w-artkalaa",   label: "Artkalaa",         src: "/marketing-pitch/artkalaa.png",    pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",              w: 235, h: 294 },
  { id: "w-kinder",     label: "Kinder",           src: "/ppm-decks/Kinder.png",            pdf: "/PPM Decks/Kinder Print Shoot.pdf",                     w: 220, h: 293 },
  { id: "w-kitser",     label: "Kitser",           src: "/marketing-pitch/kister.png",      pdf: "/Marketing Pitch/Kitser August Sale.pdf",               w: 225, h: 300 },
  { id: "w-pathan-2",   label: "Pathan Bros",      src: "/movie-ott-pitches/Pathan 2.png",  pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf",       w: 225, h: 300 },
  { id: "w-deva",       label: "Deva",             src: "/marketing-pitch/Deva.png",        pdf: "/Marketing Pitch/Deva_s Khayal.pdf",                    w: 225, h: 281 },
  { id: "w-fossil",     label: "Fossil",           src: "/treatment-notes/fossil.png",      pdf: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf",        w: 235, h: 294 },
  { id: "w-lifestyle",  label: "Lifestyle",        src: "/others/life.png",                 pdf: "/Others/Lifestyle SS_24 Cast Batch 5 (Bangkok).pdf",    w: 320, h: 240 },
  { id: "w-bubbling",   label: "The Bubbling Fish", src: "/marketing-pitch/the.png",        pdf: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf", w: 235, h: 294 },
  { id: "w-murgi-1",    label: "Murgi",            src: "/movie-ott-pitches/Murgi.png",     pdf: "/Movie - OTT pitches/Murgi.pdf",                        w: 230, h: 288 },
  { id: "w-pathan-1",   label: "Pathan Bros",      src: "/movie-ott-pitches/Pathan 1.png",  pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf",       w: 240, h: 300 },
  { id: "w-artkalaa-2", label: "Artkalaa",         src: "/marketing-pitch/artkalaa 2.png",  pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",              w: 200, h: 200 },
];

function findCoverForBrand(brand: string): string | undefined {
  const words = brand.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return undefined;
  for (const c of WALL_SRC) {
    const cWords = c.label.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).filter(Boolean);
    if (words[0] === cWords[0]) return c.src;
    if (cWords[0].startsWith(words[0]) || words[0].startsWith(cWords[0])) {
      if (words[0].length >= 3 || cWords[0].length >= 3) return c.src;
    }
    const b = words.join("");
    const cl = cWords.join("");
    if (cl.includes(b) || b.includes(cl)) return c.src;
  }
  return undefined;
}

function extractCode(url: string): string | null {
  if (!url) return null;
  const ig = url.match(/instagram\.com\/(?:[a-zA-Z0-9_.-]+\/)?(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  if (ig) return `ig:${ig[1]}`;
  const yt = getYouTubeId(url);
  if (yt) return `yt:${yt}`;
  return null;
}

const videoByCode = new Map<string, any>();
for (const ve of videoEntries) {
  const code = extractCode(ve.url);
  if (code) videoByCode.set(code, ve);
}

function getVe(url: string) {
  const code = extractCode(url);
  return code ? videoByCode.get(code) : undefined;
}

/* ------------------------------------------------------------------ */
/*  Build item list from wall-cards + archive                          */
/* ------------------------------------------------------------------ */

function buildItems(): WallItem[] {
  const items: WallItem[] = [];

  /* wall cards (cover all PDF/document projects) */
  for (const c of WALL_SRC) {
    items.push({
      id: c.id,
      label: c.label,
      src: c.src,
      pdf: c.pdf ?? undefined,
      w: c.w,
      h: c.h,
    });
  }

  for (const a of archive) {
    const ytThumb = a.thumbnail || getYouTubeThumbnail(a.url);
    if (ytThumb) {
      const ve = getVe(a.url);
      items.push({
        id: a.id,
        label: a.brand || a.title,
        src: ytThumb,
        externalUrl: a.url,
        w: ve?.w || 16,
        h: ve?.h || 9,
      });
      continue;
    }

    const ve = getVe(a.url);
    if (!ve) {
      /* PDF-only archive item → brand cover fallback */
      const cover = findCoverForBrand(a.brand || "");
      if (cover && a.documents?.length) {
        items.push({
          id: a.id,
          label: a.brand || a.title,
          src: cover,
          pdf: a.documents[0].path,
          w: 4,
          h: 3,
        });
      }
      continue;
    }

    /* Instagram reel with video */
    if (ve.hasMp4 && ve.videoUrl) {
      items.push({
        id: a.id,
        label: a.brand || a.title,
        src: "",
        externalUrl: a.url,
        w: ve.w || 1080,
        h: ve.h || 1920,
        isVideo: true,
        videoUrl: ve.videoUrl,
      });
      continue;
    }

    /* Instagram post with images array */
    if (Array.isArray(ve.images) && ve.images.length > 0) {
      items.push({
        id: a.id,
        label: a.brand || a.title,
        src: `/assets/archive/${ve.images[0]}`,
        externalUrl: a.url,
        w: ve.w || 4,
        h: ve.h || 3,
      });
      continue;
    }

    /* Instagram post with src path */
    if (ve.hasImage && ve.src) {
      items.push({
        id: a.id,
        label: a.brand || a.title,
        src: ve.src,
        externalUrl: a.url,
        w: ve.w || 4,
        h: ve.h || 3,
      });
      continue;
    }

    /* Instagram post with id-based image path */
    if (ve.hasImage) {
      items.push({
        id: a.id,
        label: a.brand || a.title,
        src: `/assets/archive/${ve.id}.jpg`,
        externalUrl: a.url,
        w: ve.w || 4,
        h: ve.h || 3,
      });
    }
  }

  return items;
}

/* ------------------------------------------------------------------ */
/*  Layout algorithm – editorial floating collage                       */
/* ------------------------------------------------------------------ */

function layoutItems(items: WallItem[], cw: number, isMobile: boolean, isTablet: boolean): { pos: CardPos[]; h: number } {
  if (cw <= 0 || items.length === 0) return { pos: [], h: 0 };
  const GAP = isMobile ? 16 : 24;
  const PAD = isMobile ? 16 : 48;
  const usable = cw - PAD * 2;
  const positions: CardPos[] = [];
  const placed: { x: number; y: number; w: number; h: number }[] = [];

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const rng = seedRng(it.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + i * 137);
    const aspect = it.w / it.h;

    let tw: number;
    if (isMobile) {
      tw = usable;
    } else if (isTablet) {
      const mx = usable * 0.5;
      const mn = usable * 0.15;
      if (aspect > 1.3) tw = mn + rng() * (mx - mn) * 0.65;
      else if (aspect < 0.76) tw = mn * 0.7 + rng() * mx * 0.35;
      else tw = mn + rng() * mx * 0.4;
    } else {
      const mx = usable * 0.45;
      const mn = usable * 0.06;
      if (aspect > 1.3) tw = mn + rng() * (mx - mn) * 0.6;
      else if (aspect < 0.76) tw = mn * 0.5 + rng() * (mx - mn) * 0.22;
      else tw = mn * 0.6 + rng() * (mx - mn) * 0.35;
    }
    const th = tw / aspect;
    const rot = isMobile ? 0 : (rng() - 0.5) * 6;

    if (isMobile) {
      const top = placed.length === 0 ? PAD : Math.max(...placed.map(p => p.y + p.h)) + GAP;
      positions.push({ x: PAD, y: top, w: tw, h: th, rotation: rot });
      placed.push({ x: PAD, y: top, w: tw, h: th });
      continue;
    }

    let best: CardPos | null = null;
    let bestScore = -Infinity;

    for (let a = 0; a < 300; a++) {
      const x = PAD + rng() * (usable - tw);
      const cy = placed.length === 0
        ? PAD
        : Math.max(...placed.map(p => p.y + p.h)) * (0.15 + rng() * 0.85);
      const y = PAD + (placed.length === 0 ? 0 : cy + (rng() - 0.5) * th * 0.35);
      const r = (rng() - 0.5) * 6;
      if (x < PAD || x + tw > cw - PAD) continue;
      let hit = false;
      for (const p of placed) { if (overlap(x, y, tw, th, p.x, p.y, p.w, p.h, GAP)) { hit = true; break; } }
      if (hit) continue;
      const edgeDist = Math.min(x - PAD, cw - PAD - (x + tw));
      const score = y * 0.15 + edgeDist * 0.15 + rng() * 50;
      if (score > bestScore) { bestScore = score; best = { x, y, w: tw, h: th, rotation: r }; }
    }

    if (!best) {
      const top = placed.length === 0 ? PAD : Math.max(...placed.map(p => p.y + p.h)) + GAP;
      const x = PAD + rng() * (usable - tw) * 0.3;
      best = { x: Math.max(PAD, x), y: top, w: tw, h: th, rotation: 0 };
    }

    positions.push(best);
    placed.push({ x: best.x, y: best.y, w: best.w, h: best.h });
  }

  const totalH = Math.max(...placed.map(p => p.y + p.h), 0) + PAD + 80;
  return { pos: positions, h: totalH };
}

/* ------------------------------------------------------------------ */
/*  Card component                                                     */
/* ------------------------------------------------------------------ */

function WallCard({ item, pos, index }: { item: WallItem; pos: CardPos; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item.isVideo) { setLoaded(true); return; }
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) { setLoaded(true); return; }
    const onLoad = () => setLoaded(true);
    const onError = () => setErrored(true);
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    return () => { img.removeEventListener("load", onLoad); img.removeEventListener("error", onError); };
  }, [item.src, item.isVideo]);

  useEffect(() => {
    if (item.isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [item.isVideo]);

  useEffect(() => {
    if (!cardRef.current || errored) return;
    const el = cardRef.current;
    const handler = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const offset = (rect.top + rect.height / 2 - vh / 2) / vh;
      const rate = 0.03 + (index % 4) * 0.012;
      el.style.setProperty("--par-y", `${offset * rate * 100}px`);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [index, errored, loaded, item.isVideo]);

  if (errored) return null;

  const handleClick = () => {
    if (item.externalUrl) { window.open(item.externalUrl, "_blank", "noopener,noreferrer"); }
    else if (item.pdf) { window.open(item.pdf, "_blank"); }
  };

  return (
    <div
      ref={cardRef}
      className="absolute"
      style={{
        left: pos.x,
        top: pos.y,
        width: pos.w,
        height: pos.h,
        transform: `rotate(${pos.rotation}deg) translateY(var(--par-y, 0px))`,
        opacity: 0,
        animation: `wallIn 0.8s ease ${0.025 + index * 0.035}s forwards`,
        willChange: "transform",
        zIndex: hovered ? 20 : 1,
      }}
    >
      <div
        className="relative overflow-hidden cursor-pointer w-full h-full"
        style={{
          borderRadius: "14px",
          backgroundColor: "#141414",
          transform: hovered ? "scale(1.03) rotate(0deg)" : "scale(1)",
          boxShadow: hovered ? "0 24px 64px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.25)",
          transition: "transform 0.5s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.5s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        {item.isVideo ? (
          <video
            ref={videoRef}
            src={`/api/video?url=${encodeURIComponent(item.videoUrl || "")}`}
            className="w-full h-full object-cover align-middle"
            muted
            loop
            playsInline
            preload="auto"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)",
            }}
          />
        ) : (
          <>
            {!loaded && (
              <div className="w-full h-full bg-[#1a1a1a] animate-pulse" />
            )}
            <img
              ref={imgRef}
              src={getMediaUrl(item.src)}
              alt={item.label}
              className={`w-full h-full object-cover align-middle ${loaded ? "opacity-100" : "opacity-0"}`}
              style={{
                transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.25,0.1,0.25,1)",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
              loading="lazy"
              draggable={false}
            />
          </>
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "14px",
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 70%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none p-4"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <p className="text-body-sm font-switzer font-[400] text-cinema-white leading-tight">
            {item.label}
          </p>
          {item.pdf && (
            <span className="text-caption font-switzer font-[400] text-cinema-white/60 uppercase tracking-[0.02em] inline-flex items-center gap-1 mt-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Document
            </span>
          )}
          {item.externalUrl && !item.pdf && (
            <span className="text-caption font-switzer font-[400] text-gold/70 uppercase tracking-[0.02em] mt-1 inline-block">
              Open Project
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

function Skeleton() {
  return (
    <div className="relative" style={{ height: "60vh" }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-[#1a1a1a] animate-pulse"
          style={{
            borderRadius: "14px",
            left: `${6 + (i % 5) * 18}%`,
            top: `${6 + Math.floor(i / 5) * 40}%`,
            width: `${10 + (i % 4) * 5}%`,
            aspectRatio: i % 3 === 0 ? "4/3" : i % 3 === 1 ? "3/4" : "1/1",
            transform: `rotate(${(i - 2) * 1.5}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

export default function ProductionWall() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.04 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const el = containerRef.current;
    if (!el) return;
    const m = () => {
      setCw(el.clientWidth);
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    m();
    setTimeout(() => setReady(true), 200);
    window.addEventListener("resize", m, { passive: true });
    return () => window.removeEventListener("resize", m);
  }, [visible]);

  const [items] = useState(() => buildItems());

  const layout = useMemo(
    () => layoutItems(items, cw, isMobile, isTablet),
    [items, cw, isMobile, isTablet],
  );

  return (
    <section
      id="wall"
      ref={sectionRef}
      className="w-full relative overflow-hidden bg-cinema-black"
      style={{ padding: "clamp(40px, 6vw, 80px) 0" }}
      aria-label="Production Archive Wall"
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        opacity: 0.035,
      }} />

      <div className="relative z-10 max-w-[1500px] mx-auto px-8 md:px-10">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">
            Production Archive
          </p>
          <h2
            className="font-switzer font-[300] leading-[1] tracking-[-0.03em] mt-3"
            style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}
          >
            The Wall
          </h2>
          {ready && (
            <p className="text-caption font-switzer font-[400] text-stone/60 mt-2">
              {items.length} projects
            </p>
          )}
        </div>

        {!ready && <Skeleton />}

        {ready && items.length > 0 && (
          <div
            ref={containerRef}
            className="relative"
            style={{
              height: layout.h,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            {items.map((item, i) => {
              const pos = layout.pos[i];
              if (!pos) return null;
              return <WallCard key={item.id} item={item} pos={pos} index={i} />;
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes wallIn {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
