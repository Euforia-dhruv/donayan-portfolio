"use client";

import { useState, useEffect, useRef } from "react";

interface WallImage {
  id: string;
  src: string;
  aspect: string;
  pdf: string | null;
}

const allImages: WallImage[] = [
  { id: "w-sprite", src: "/PPM Decks/Sprite.png", aspect: "4:3", pdf: null },
  { id: "w-centrum", src: "/PPM Decks/Centrum.png", aspect: "16:9", pdf: null },
  { id: "w-ax", src: "/PPM Decks/AX.png", aspect: "4:5", pdf: "/PPM Decks/AX Celebrity Shoot SS_25.pdf" },
  { id: "w-idee", src: "/PPM Decks/IDEE.png", aspect: "4:3", pdf: "/PPM Decks/IDEE PPM.pdf" },
  { id: "w-hdfc", src: "/PPM Decks/HDFC.png", aspect: "16:9", pdf: "/PPM Decks/HDFC KVS Post PPM Deck.pdf" },
  { id: "w-kinder", src: "/PPM Decks/Kinder.png", aspect: "3:4", pdf: "/PPM Decks/Kinder Print Shoot.pdf" },
  { id: "w-fossil", src: "/Treatment Notes/Fossil.png", aspect: "4:5", pdf: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf" },
  { id: "w-godrej", src: "/Treatment Notes/godrej.png", aspect: "4:3", pdf: "/Treatment Notes/Godrej Capital - Director_s Note.pdf" },
  { id: "w-ponds", src: "/Treatment Notes/ponds.png", aspect: "16:9", pdf: "/Treatment Notes/Ponds  BB cream TN.pdf" },
  { id: "w-tanishq", src: "/Others/Tanishq.png", aspect: "3:4", pdf: "/Others/Tanishq Casting.pdf" },
  { id: "w-lifestyle", src: "/Others/lifestyle.png", aspect: "4:3", pdf: null },
  { id: "w-artkalaa", src: "/Marketing Pitch/artkalaa.png", aspect: "4:5", pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf" },
  { id: "w-artkalaa-2", src: "/Marketing Pitch/artkalaa 2.png", aspect: "1:1", pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf" },
  { id: "w-oool", src: "/Marketing Pitch/oool.png", aspect: "4:3", pdf: "/Marketing Pitch/OOOL Digital Strategy.pdf" },
  { id: "w-kitser", src: "/Marketing Pitch/kister.png", aspect: "3:4", pdf: "/Marketing Pitch/Kitser August Sale.pdf" },
  { id: "w-deva", src: "/Marketing Pitch/Deva.png", aspect: "4:5", pdf: "/Marketing Pitch/Deva_s Khayal.pdf" },
  { id: "w-justbe", src: "/Marketing Pitch/Just be.png", aspect: "16:9", pdf: "/Marketing Pitch/Just Be.pdf" },
  { id: "w-bubbling", src: "/Marketing Pitch/the.png", aspect: "4:5", pdf: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf" },
  { id: "w-murgi-1", src: "/Movie - OTT pitches/Murgi.png", aspect: "4:5", pdf: "/Movie - OTT pitches/Murgi.pdf" },
  { id: "w-murgi-2", src: "/Movie - OTT pitches/Murgi 1.png", aspect: "9:16", pdf: "/Movie - OTT pitches/Murgi.pdf" },
  { id: "w-pathan-1", src: "/Movie - OTT pitches/Pathan 1.png", aspect: "4:5", pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf" },
  { id: "w-pathan-2", src: "/Movie - OTT pitches/Pathan 2.png", aspect: "3:4", pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf" },
];

const images = allImages;

interface CardLayout {
  id: string;
  src: string;
  pdf: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  z: number;
}

function seededRand(seed: number) {
  let s = seed * 9301 + 49297;
  s = ((s << 13) ^ s) & 0x7fffffff;
  return () => {
    s = (s * 16807) & 0x7fffffff;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
}

function genLayout(imgs: WallImage[], containerW: number, containerH: number): CardLayout[] {
  const rand = seededRand(42);
  const pad = 60;
  const useW = containerW - pad * 2;
  const useH = containerH - 200;

  const cols = Math.min(imgs.length, Math.max(3, Math.floor(useW / 260)));
  const rows = Math.ceil(imgs.length / cols);
  const cellW = useW / cols;
  const cellH = Math.max(useH / rows, 180);
  const base = Math.min(cellW * 0.55, 200);

  return imgs.map((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const sizeMul = 0.8 + rand() * 0.4;
    const [aw, ah] = img.aspect.split(":").map(Number);
    const ratio = aw / ah;
    const w = Math.round(base * ratio * sizeMul);
    const h = Math.round(base * sizeMul);
    const maxOx = Math.max(0, cellW - w - 10);
    const maxOy = Math.max(0, cellH - h - 10);
    const ox = maxOx > 0 ? rand() * maxOx : 0;
    const oy = maxOy > 0 ? rand() * maxOy : 0;
    const rot = (rand() - 0.5) * 6;
    const z = Math.floor(rand() * imgs.length);

    return {
      id: img.id,
      src: img.src,
      pdf: img.pdf,
      x: Math.round(pad + col * cellW + ox),
      y: Math.round(pad + row * cellH + oy + 140),
      w,
      h,
      rot: Math.round(rot * 10) / 10,
      z,
    };
  });
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ProductionWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<CardLayout[]>([]);
  const [visible, setVisible] = useState(false);
  const [sectionH, setSectionH] = useState(0);
  const [ordered] = useState(() => shuffle(images));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const lay = genLayout(ordered, w, h);
    setLayout(lay);
    const maxY = lay.reduce((m, c) => Math.max(m, c.y + c.h), 0);
    setSectionH(Math.max(h, maxY + 100));
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, [ordered]);

  const handleClick = (pdf: string | null, src: string) => {
    window.open(pdf || src, "_blank");
  };

  return (
    <section
      ref={sectionRef}
      className="w-full relative"
      style={{ backgroundColor: "#0b0b0b", minHeight: sectionH || "100vh" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        opacity: 0.035,
      }} />

      <div className="absolute top-12 left-0 right-0 z-10 pointer-events-none text-center">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">Production Archive</p>
        <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">The Wall</h2>
      </div>

      <div style={{ height: sectionH || "100vh" }}>
        {layout.map((card, i) => {
          const delay = Math.min(i * 0.08, 1.2);
          const origZ = card.z;
          return (
            <div
              key={card.id}
              className="absolute cursor-pointer"
              style={{
                left: card.x,
                top: card.y,
                width: card.w,
                height: card.h,
                zIndex: origZ,
                opacity: 0,
                animation: visible ? `cardEntrance 0.9s ease-out ${delay}s forwards` : "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.zIndex = "999"; }}
              onMouseLeave={(e) => { e.currentTarget.style.zIndex = String(origZ); }}
              onClick={() => handleClick(card.pdf, card.src)}
            >
              <div
                className="w-full h-full overflow-hidden"
                style={{
                  transform: `rotate(${card.rot}deg)`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease, filter 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = `rotate(${card.rot}deg) scale(1.03)`;
                  el.style.boxShadow = "0 12px 48px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.4)";
                  el.style.filter = "brightness(1.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = `rotate(${card.rot}deg)`;
                  el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)";
                  el.style.filter = "brightness(1)";
                }}
              >
                <img
                  src={card.src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
