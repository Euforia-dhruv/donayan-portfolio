"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";

interface WallImage {
  id: string;
  src: string;
  aspect: string;
}

interface CardLayout {
  id: string;
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  z: number;
  sizeMul: number;
}

const images: WallImage[] = [
  { id: "w-sprite", src: "/PPM Decks/Sprite.png", aspect: "4:3" },
  { id: "w-centrum", src: "/PPM Decks/Centrum.png", aspect: "16:9" },
  { id: "w-ax", src: "/PPM Decks/AX.png", aspect: "4:5" },
  { id: "w-idee", src: "/PPM Decks/IDEE.png", aspect: "4:3" },
  { id: "w-hdfc", src: "/PPM Decks/HDFC.png", aspect: "16:9" },
  { id: "w-kinder", src: "/PPM Decks/Kinder.png", aspect: "3:4" },
  { id: "w-fossil", src: "/Treatment Notes/Fossil.png", aspect: "4:5" },
  { id: "w-godrej", src: "/Treatment Notes/godrej.png", aspect: "4:3" },
  { id: "w-ponds", src: "/Treatment Notes/ponds.png", aspect: "16:9" },
  { id: "w-tanishq", src: "/Others/Tanishq.png", aspect: "3:4" },
  { id: "w-lifestyle", src: "/Others/lifestyle.png", aspect: "4:3" },
  { id: "w-artkalaa", src: "/Marketing Pitch/artkalaa.png", aspect: "4:5" },
  { id: "w-artkalaa-2", src: "/Marketing Pitch/artkalaa 2.png", aspect: "1:1" },
  { id: "w-oool", src: "/Marketing Pitch/oool.png", aspect: "4:3" },
  { id: "w-kitser", src: "/Marketing Pitch/kister.png", aspect: "3:4" },
  { id: "w-deva", src: "/Marketing Pitch/Deva.png", aspect: "4:5" },
  { id: "w-justbe", src: "/Marketing Pitch/Just be.png", aspect: "16:9" },
  { id: "w-bubbling", src: "/Marketing Pitch/the.png", aspect: "4:5" },
  { id: "w-murgi-1", src: "/Movie - OTT pitches/Murgi.png", aspect: "4:5" },
  { id: "w-murgi-2", src: "/Movie - OTT pitches/Murgi 1.png", aspect: "9:16" },
  { id: "w-pathan-1", src: "/Movie - OTT pitches/Pathan 1.png", aspect: "4:5" },
  { id: "w-pathan-2", src: "/Movie - OTT pitches/Pathan 2.png", aspect: "3:4" },
];

function getDim(aspect: string, base: number): [number, number] {
  const [a, b] = aspect.split(":").map(Number);
  const r = a / b;
  return r >= 1 ? [base * r, base] : [base, base / r];
}

function seededRand(seed: number) {
  let s = seed * 9301 + 49297;
  s = ((s << 13) ^ s) & 0x7fffffff;
  return () => {
    s = (s * 16807) & 0x7fffffff;
    return (s & 0x7fffffff) / 0x7fffffff;
  };
}

function genLayout(imgs: WallImage[], containerW: number): CardLayout[] {
  const base = Math.min(180, containerW * 0.12);
  const pad = 60;
  const useW = containerW - pad * 2;
  const cols = Math.max(3, Math.ceil(Math.sqrt(imgs.length * 2.5)));
  const rows = Math.ceil(imgs.length / cols);
  const cellW = useW / cols;
  const cellH = cellW * 0.85;
  const totalH = rows * cellH + pad * 2;

  const rand = seededRand(42);

  return imgs.map((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const sizeMul = 0.75 + rand() * 0.5;
    const [w, h] = getDim(img.aspect, base * sizeMul);
    const ox = rand() * (cellW - w * 0.7);
    const oy = rand() * (cellH - h * 0.7);
    const rot = (rand() - 0.5) * 8;
    const z = Math.floor(rand() * images.length);
    return {
      id: img.id,
      src: img.src,
      x: pad + col * cellW + ox,
      y: pad + row * cellH + oy,
      w: Math.round(w),
      h: Math.round(h),
      rot: Math.round(rot * 10) / 10,
      z,
      sizeMul,
    };
  });
}

function Lightbox({ images, currentIndex, onClose, onNavigate }: { images: WallImage[]; currentIndex: number; onClose: () => void; onNavigate: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const img = images[currentIndex];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose, currentIndex, onNavigate, images.length]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-cinema-black/95 backdrop-blur-xl cursor-pointer"
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-cinema-white/50 hover:text-cinema-white bg-transparent border-none cursor-pointer z-10 transition-colors" aria-label="Close">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {currentIndex > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-cinema-white/50 hover:text-cinema-white bg-transparent border-none cursor-pointer z-10 transition-colors p-2" aria-label="Previous">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-cinema-white/50 hover:text-cinema-white bg-transparent border-none cursor-pointer z-10 transition-colors p-2" aria-label="Next">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-caption font-switzer font-[400] text-cinema-white/40 z-10">
        {currentIndex + 1} / {images.length}
      </div>

      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt="" className="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>
  );
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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const handleClose = useCallback(() => setLightboxIndex(null), []);
  const [ordered] = useState(() => shuffle(images));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const parent = el.parentElement!;
    const w = parent.clientWidth;
    const lay = genLayout(ordered, w);
    setLayout(lay);
    const maxY = lay.reduce((m, c) => Math.max(m, c.y + c.h), 0);
    setSectionH(Math.max(window.innerHeight, maxY + 80));
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, [ordered]);

  return (
    <>
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

        <div style={{ paddingTop: 140, paddingBottom: 60 }}>
          {layout.map((card, i) => {
            const delay = Math.min(i * 0.06, 1.8);
            const origZ = card.z;
            return (
              <div
                key={card.id}
                className="absolute cursor-pointer"
                style={{
                  left: card.x,
                  top: card.y + 140,
                  width: card.w,
                  height: card.h,
                  zIndex: origZ,
                  opacity: 0,
                  animation: visible ? `cardEntrance 0.8s ease-out ${delay}s forwards` : "none",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.zIndex = "999"; }}
                onMouseLeave={(e) => { e.currentTarget.style.zIndex = String(origZ); }}
                onClick={() => setLightboxIndex(i)}
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

      {lightboxIndex !== null && (
        <Lightbox
          images={ordered}
          currentIndex={lightboxIndex}
          onClose={handleClose}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
