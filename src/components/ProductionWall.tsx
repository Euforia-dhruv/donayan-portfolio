"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { getMediaUrl } from "@/lib/media";

interface WallCard {
  id: string;
  src: string;
  title: string;
  pdf: string | null;
  w: number;
  h: number;
}

interface CardPos {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
}

const allCards: WallCard[] = [
  { id: "w-centrum",    src: "/ppm-decks/Centrum.png",            title: "Centrum",          pdf: null,                                              w: 400, h: 225 },
  { id: "w-hdfc",       src: "/ppm-decks/HDFC.png",               title: "HDFC KVS",        pdf: "/PPM Decks/HDFC KVS Post PPM Deck.pdf",           w: 440, h: 248 },
  { id: "w-murgi-2",    src: "/movie-ott-pitches/Murgi 1.png",    title: "Murgi",            pdf: "/Movie - OTT pitches/Murgi.pdf",                  w: 185, h: 329 },
  { id: "w-ponds",      src: "/treatment-notes/ponds.png",        title: "Ponds BB Cream",   pdf: "/Treatment Notes/Ponds  BB cream TN.pdf",         w: 420, h: 236 },
  { id: "w-justbe",     src: "/marketing-pitch/Just be.png",      title: "Just Be",          pdf: "/Marketing Pitch/Just Be.pdf",                    w: 360, h: 203 },
  { id: "w-tanishq",    src: "/others/Tanishq.png",               title: "Tanishq",          pdf: "/Others/Tanishq Casting.pdf",                     w: 220, h: 293 },
  { id: "w-sprite",     src: "/ppm-decks/Sprite.png",             title: "Sprite",           pdf: null,                                              w: 340, h: 255 },
  { id: "w-idee",       src: "/ppm-decks/IDEE.png",               title: "IDEE",             pdf: "/PPM Decks/IDEE PPM.pdf",                        w: 360, h: 270 },
  { id: "w-godrej",     src: "/treatment-notes/godrej.png",       title: "Godrej Capital",   pdf: "/Treatment Notes/Godrej Capital - Director_s Note.pdf", w: 340, h: 255 },
  { id: "w-oool",       src: "/marketing-pitch/oool.png",         title: "OOOL Digital",     pdf: "/Marketing Pitch/OOOL Digital Strategy.pdf",      w: 340, h: 255 },
  { id: "w-ax",         src: "/ppm-decks/AX.png",                 title: "AX",               pdf: "/PPM Decks/AX Celebrity Shoot SS_25.pdf",         w: 230, h: 288 },
  { id: "w-artkalaa",   src: "/marketing-pitch/artkalaa.png",     title: "Artkalaa",         pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",        w: 235, h: 294 },
  { id: "w-kinder",     src: "/ppm-decks/Kinder.png",             title: "Kinder",           pdf: "/PPM Decks/Kinder Print Shoot.pdf",               w: 220, h: 293 },
  { id: "w-kitser",     src: "/marketing-pitch/kister.png",       title: "Kitser",           pdf: "/Marketing Pitch/Kitser August Sale.pdf",         w: 225, h: 300 },
  { id: "w-pathan-2",   src: "/movie-ott-pitches/Pathan 2.png",   title: "Pathan Bros",      pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf", w: 225, h: 300 },
  { id: "w-deva",       src: "/marketing-pitch/Deva.png",         title: "Deva",             pdf: "/Marketing Pitch/Deva_s Khayal.pdf",              w: 225, h: 281 },
  { id: "w-fossil",     src: "/treatment-notes/fossil.png",       title: "Fossil",           pdf: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf",  w: 235, h: 294 },
  { id: "w-lifestyle",  src: "/others/life.png",                  title: "Lifestyle",        pdf: "/Others/Lifestyle SS_24 Cast Batch 5 (Bangkok).pdf", w: 320, h: 240 },
  { id: "w-bubbling",   src: "/marketing-pitch/the.png",          title: "The Bubbling Fish", pdf: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf", w: 235, h: 294 },
  { id: "w-murgi-1",    src: "/movie-ott-pitches/Murgi.png",      title: "Murgi",            pdf: "/Movie - OTT pitches/Murgi.pdf",                  w: 230, h: 288 },
  { id: "w-pathan-1",   src: "/movie-ott-pitches/Pathan 1.png",   title: "Pathan Bros",      pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf", w: 240, h: 300 },
  { id: "w-artkalaa-2", src: "/marketing-pitch/artkalaa 2.png",   title: "Artkalaa",         pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",        w: 200, h: 200 },
];

function seeded(seed: number) {
  let s = Math.abs(seed) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function overlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number, gap: number
): boolean {
  return ax - gap < bx + bw && ax + aw + gap > bx && ay - gap < by + bh && ay + ah + gap > by;
}

function layoutCards(cards: WallCard[], cw: number, isMobile: boolean, isTablet: boolean): { pos: CardPos[]; h: number } {
  if (cw <= 0 || cards.length === 0) return { pos: [], h: 0 };

  const PAD = isMobile ? 16 : 48;
  const GAP = isMobile ? 16 : 24;
  const usable = cw - PAD * 2;
  const positions: CardPos[] = [];
  const placed: { x: number; y: number; w: number; h: number }[] = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const seed = card.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + i * 137;
    const rand = seeded(seed);
    const aspect = card.w / card.h;

    let tw: number;
    if (isMobile) {
      tw = usable;
    } else if (isTablet) {
      const max = usable * 0.5;
      const min = usable * 0.15;
      if (aspect > 1.3) tw = min + rand() * (max - min) * 0.65;
      else if (aspect < 0.8) tw = min * 0.7 + rand() * max * 0.35;
      else tw = min + rand() * max * 0.4;
    } else {
      const max = usable * 0.45;
      const min = usable * 0.07;
      if (aspect > 1.3) tw = min + rand() * (max - min) * 0.6;
      else if (aspect < 0.8) tw = min * 0.6 + rand() * (max - min) * 0.25;
      else tw = min * 0.7 + rand() * (max - min) * 0.35;
    }
    const th = tw / aspect;
    const rot = isMobile ? 0 : (rand() - 0.5) * 6;

    if (isMobile) {
      const top = placed.length === 0 ? PAD : Math.max(...placed.map(p => p.y + p.h)) + GAP;
      positions.push({ x: PAD, y: top, w: tw, h: th, rotation: rot });
      placed.push({ x: PAD, y: top, w: tw, h: th });
      continue;
    }

    let best: CardPos | null = null;
    let bestScore = -Infinity;

    for (let a = 0; a < 250; a++) {
      const x = PAD + rand() * (usable - tw);
      const cy = placed.length === 0
        ? PAD
        : Math.max(...placed.map(p => p.y + p.h)) * (0.2 + rand() * 0.8);
      const y = PAD + (placed.length === 0 ? 0 : cy + (rand() - 0.5) * th * 0.4);
      const r = (rand() - 0.5) * 6;

      if (x < PAD || x + tw > cw - PAD) continue;

      let hit = false;
      for (const p of placed) {
        if (overlap(x, y, tw, th, p.x, p.y, p.w, p.h, GAP)) { hit = true; break; }
      }
      if (hit) continue;

      const cx = usable / 2;
      const dx = Math.abs(x + tw / 2 - cx - PAD);
      const score = y - dx * 0.3 + rand() * 40;
      if (score > bestScore) { bestScore = score; best = { x, y, w: tw, h: th, rotation: r }; }
    }

    if (!best) {
      const top = placed.length === 0 ? PAD : Math.max(...placed.map(p => p.y + p.h)) + GAP;
      best = { x: PAD, y: top, w: tw, h: th, rotation: 0 };
    }

    positions.push(best);
    placed.push({ x: best.x, y: best.y, w: best.w, h: best.h });
  }

  const totalH = Math.max(...placed.map(p => p.y + p.h), 0) + PAD + 80;
  return { pos: positions, h: totalH };
}

function WallCard({
  layout,
  card,
  index,
}: {
  layout: CardPos;
  card: WallCard;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) { setLoaded(true); return; }
    const onLoad = () => setLoaded(true);
    const onError = () => setErrored(true);
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    return () => { img.removeEventListener("load", onLoad); img.removeEventListener("error", onError); };
  }, []);

  useEffect(() => {
    if (!cardRef.current || errored) return;
    const el = cardRef.current;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) / vh;
      const rate = 0.04 + (index % 3) * 0.015;
      el.style.setProperty("--parallax-y", `${offset * rate * 100}px`);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [index, errored, loaded]);

  if (errored) return null;

  return (
    <div
      ref={cardRef}
      className="absolute"
      style={{
        left: layout.x,
        top: layout.y,
        width: layout.w,
        height: layout.h,
        transform: `
          rotate(${layout.rotation}deg)
          translateY(var(--parallax-y, 0px))
        `,
        opacity: 0,
        animation: `fadeSlideIn 0.7s ease ${0.03 + index * 0.045}s forwards`,
        willChange: "transform",
        zIndex: hovered ? 10 : 1,
        transition: "z-index 0s",
      }}
    >
      <div
        className="relative overflow-hidden cursor-pointer w-full h-full"
        style={{
          borderRadius: "14px",
          backgroundColor: "#141414",
          transform: hovered ? "scale(1.03) rotate(0deg)" : "scale(1)",
          boxShadow: hovered
            ? "0 24px 64px rgba(0,0,0,0.6)"
            : "0 4px 12px rgba(0,0,0,0.25)",
          transition:
            "transform 0.5s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.5s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (card.pdf) window.open(card.pdf, "_blank");
        }}
      >
        {!loaded && (
          <div className="w-full h-full bg-[#1a1a1a] animate-pulse" />
        )}

        <img
          ref={imgRef}
          src={getMediaUrl(card.src)}
          alt={card.title}
          className={`w-full h-full object-cover align-middle ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{
            transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.25,0.1,0.25,1)",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
          loading="lazy"
          draggable={false}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "14px",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 70%)",
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
            {card.title}
          </p>
          {card.pdf && (
            <span className="text-caption font-switzer font-[400] text-cinema-white/60 uppercase tracking-[0.02em] inline-flex items-center gap-1 mt-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              View Document
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductionWall() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [validCards, setValidCards] = useState<WallCard[]>([]);
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
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const check = async () => {
      const results: WallCard[] = [];
      for (const card of allCards) {
        try {
          const url = getMediaUrl(card.src);
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) results.push(card);
        } catch { /* skip */ }
      }
      setValidCards(results);
      setReady(true);
    };
    check();
  }, [visible]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      setCw(el.clientWidth);
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  const layout = useMemo(
    () => layoutCards(validCards, cw, isMobile, isTablet),
    [validCards, cw, isMobile, isTablet]
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
        </div>

        {!ready && (
          <div className="relative" style={{ height: "60vh" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-[#1a1a1a] animate-pulse"
                style={{
                  borderRadius: "14px",
                  left: `${8 + (i % 4) * 22}%`,
                  top: `${8 + Math.floor(i / 4) * 35}%`,
                  width: `${12 + (i % 3) * 6}%`,
                  aspectRatio:
                    i % 3 === 0 ? "4/3" : i % 3 === 1 ? "3/4" : "1/1",
                  transform: `rotate(${(i - 2) * 1.5}deg)`,
                }}
              />
            ))}
          </div>
        )}

        {ready && validCards.length === 0 && (
          <div className="text-center py-20">
            <p className="text-body font-switzer font-[300] text-stone">
              No wall cards available.
            </p>
          </div>
        )}

        {ready && validCards.length > 0 && (
          <div
            ref={containerRef}
            className="relative"
            style={{
              height: layout.h,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          >
            {validCards.map((card, i) => {
              const pos = layout.pos[i];
              if (!pos) return null;
              return (
                <WallCard
                  key={card.id}
                  layout={pos}
                  card={card}
                  index={i}
                />
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
