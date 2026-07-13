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

/* ------------------------------------------------------------------ */
/*  Wall-card source data                                              */
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

/* ------------------------------------------------------------------ */
/*  Brand → cover matching                                             */
/* ------------------------------------------------------------------ */

function findCoverForBrand(brand: string): string | undefined {
  const words = brand.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return;
  for (const c of WALL_SRC) {
    const cWords = c.label.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim().split(/\s+/).filter(Boolean);
    if (words[0] === cWords[0]) return c.src;
    if (cWords[0].startsWith(words[0]) || words[0].startsWith(cWords[0])) {
      if (words[0].length >= 3 || cWords[0].length >= 3) return c.src;
    }
    if (cWords.join("").includes(words.join("")) || words.join("").includes(cWords.join(""))) return c.src;
  }
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
/*  Build item list                                                    */
/* ------------------------------------------------------------------ */

function buildItems(): WallItem[] {
  const items: WallItem[] = [];
  for (const c of WALL_SRC) {
    items.push({ id: c.id, label: c.label, src: c.src, pdf: c.pdf ?? undefined, w: c.w, h: c.h });
  }
  for (const a of archive) {
    const ytThumb = a.thumbnail || getYouTubeThumbnail(a.url);
    if (ytThumb) {
      const ve = getVe(a.url);
      items.push({ id: a.id, label: a.brand || a.title, src: ytThumb, externalUrl: a.url, w: ve?.w || 16, h: ve?.h || 9 });
      continue;
    }
    const ve = getVe(a.url);
    if (!ve) {
      const cover = findCoverForBrand(a.brand || "");
      if (cover && a.documents?.length) {
        items.push({ id: a.id, label: a.brand || a.title, src: cover, pdf: a.documents[0].path, w: 4, h: 3 });
      }
      continue;
    }
    if (ve.hasMp4 && ve.videoUrl) {
      items.push({ id: a.id, label: a.brand || a.title, src: "", externalUrl: a.url, w: ve.w || 1080, h: ve.h || 1920, isVideo: true, videoUrl: ve.videoUrl });
      continue;
    }
    if (Array.isArray(ve.images) && ve.images.length > 0) {
      items.push({ id: a.id, label: a.brand || a.title, src: `/assets/archive/${ve.images[0]}`, externalUrl: a.url, w: ve.w || 4, h: ve.h || 3 });
      continue;
    }
    if (ve.hasImage && ve.src) {
      items.push({ id: a.id, label: a.brand || a.title, src: ve.src, externalUrl: a.url, w: ve.w || 4, h: ve.h || 3 });
      continue;
    }
    if (ve.hasImage) {
      items.push({ id: a.id, label: a.brand || a.title, src: `/assets/archive/${ve.id}.jpg`, externalUrl: a.url, w: ve.w || 4, h: ve.h || 3 });
    }
  }
  return items;
}

/* ------------------------------------------------------------------ */
/*  Rotation helper (deterministic)                                    */
/* ------------------------------------------------------------------ */

function getRotation(id: string, i: number): number {
  let h = 0;
  const s = (id + String(i)).split("").forEach(c => { h = (h * 31 + c.charCodeAt(0)) % 1000; });
  return ((h % 7) - 3) * 0.6;
}

/* ------------------------------------------------------------------ */
/*  Card component                                                     */
/* ------------------------------------------------------------------ */

function WallCard({ item, index, total }: { item: WallItem; index: number; total: number }) {
  const [loaded, setLoaded] = useState(!item.isVideo);
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
    if (item.isVideo && videoRef.current) videoRef.current.play().catch(() => {});
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
  }, [index, errored, loaded]);

  if (errored) return null;

  const rotation = getRotation(item.id, index);

  const handleClick = () => {
    if (item.externalUrl) window.open(item.externalUrl, "_blank", "noopener,noreferrer");
    else if (item.pdf) window.open(item.pdf, "_blank");
  };

  return (
    <div
      ref={cardRef}
      className="break-inside-avoid mb-6"
      style={{
        opacity: 0,
        animation: `wallFadeIn 0.6s ease ${0.02 + index * 0.02}s forwards`,
        transform: `rotate(${rotation}deg) translateY(var(--par-y, 0px))`,
        willChange: "transform",
        zIndex: hovered ? 10 : 1,
        transition: "z-index 0s",
      }}
    >
      <div
        className="relative overflow-hidden cursor-pointer w-full group"
        style={{
          borderRadius: "14px",
          backgroundColor: "#141414",
          aspectRatio: `${item.w} / ${item.h}`,
          transform: hovered ? "scale(1.02) rotate(0deg)" : "scale(1)",
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
            className="absolute inset-0 w-full h-full object-cover"
            muted loop playsInline preload="auto"
            style={{
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)",
            }}
          />
        ) : (
          <>
            {!loaded && (
              <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />
            )}
            <img
              ref={imgRef}
              src={getMediaUrl(item.src)}
              alt={item.label}
              className={`absolute inset-0 w-full h-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
              style={{
                transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.25,0.1,0.25,1)",
                transform: hovered ? "scale(1.04)" : "scale(1)",
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
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

export default function ProductionWall() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [items] = useState(() => buildItems());

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

  return (
    <section
      id="wall"
      ref={sectionRef}
      className="w-full relative bg-cinema-black"
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
          <p className="text-caption font-switzer font-[400] text-stone/60 mt-2">
            {items.length} projects
          </p>
        </div>

        <div
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {items.map((item, i) => (
            <WallCard key={item.id} item={item} index={i} total={items.length} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes wallFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
