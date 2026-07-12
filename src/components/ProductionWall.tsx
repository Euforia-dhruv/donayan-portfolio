"use client";

import { useState, useRef, useEffect } from "react";

interface WallImage {
  id: string;
  src: string;
  aspect: string;
  pdf: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  z: number;
}

const cards: WallImage[] = [
  // ── LEFT CLUSTER ──────────────────────────────────────
  { id: "w-centrum",  src: "/PPM Decks/Centrum.png",             aspect: "16:9", pdf: null,
    x: 40,   y: 150,  w: 400,  h: 225,  rot: -1,   z: 100 },
  { id: "w-murgi-2",  src: "/Movie - OTT pitches/Murgi 1.png",   aspect: "9:16", pdf: "/Movie - OTT pitches/Murgi.pdf",
    x: 390,  y: 130,  w: 190,  h: 338,  rot: 1.5,  z: 80 },
  { id: "w-sprite",   src: "/PPM Decks/Sprite.png",              aspect: "4:3",  pdf: null,
    x: 40,   y: 335,  w: 320,  h: 240,  rot: 0.5,  z: 90 },
  { id: "w-fossil",   src: "/Treatment Notes/fossil.png",         aspect: "4:5",  pdf: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf",
    x: 300,  y: 315,  w: 240,  h: 300,  rot: -1.5, z: 70 },
  { id: "w-ax",       src: "/PPM Decks/AX.png",                  aspect: "4:5",  pdf: "/PPM Decks/AX Celebrity Shoot SS_25.pdf",
    x: 30,   y: 540,  w: 240,  h: 300,  rot: 1,    z: 60 },
  { id: "w-lifestyle",src: "/Others/life.png",                    aspect: "4:3",  pdf: null,
    x: 275,  y: 555,  w: 270,  h: 203,  rot: -0.5, z: 85 },

  // ── CENTER CLUSTER ────────────────────────────────────
  { id: "w-hdfc",     src: "/PPM Decks/HDFC.png",                aspect: "16:9", pdf: "/PPM Decks/HDFC KVS Post PPM Deck.pdf",
    x: 510,  y: 140,  w: 420,  h: 236,  rot: 0.5,  z: 110 },
  { id: "w-tanishq",  src: "/Others/Tanishq.png",                aspect: "3:4",  pdf: "/Others/Tanishq Casting.pdf",
    x: 870,  y: 115,  w: 230,  h: 307,  rot: -1.5, z: 75 },
  { id: "w-idee",     src: "/PPM Decks/IDEE.png",                aspect: "4:3",  pdf: "/PPM Decks/IDEE PPM.pdf",
    x: 520,  y: 330,  w: 350,  h: 263,  rot: -0.5, z: 95 },
  { id: "w-artkalaa", src: "/Marketing Pitch/artkalaa.png",      aspect: "4:5",  pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",
    x: 400,  y: 300,  w: 245,  h: 306,  rot: 2,    z: 65 },
  { id: "w-kinder",   src: "/PPM Decks/Kinder.png",              aspect: "3:4",  pdf: "/PPM Decks/Kinder Print Shoot.pdf",
    x: 820,  y: 305,  w: 225,  h: 300,  rot: 1,    z: 88 },
  { id: "w-kitser",   src: "/Marketing Pitch/kister.png",        aspect: "3:4",  pdf: "/Marketing Pitch/Kitser August Sale.pdf",
    x: 630,  y: 540,  w: 230,  h: 307,  rot: -1,   z: 55 },
  { id: "w-artkalaa-2", src: "/Marketing Pitch/artkalaa 2.png",  aspect: "1:1",  pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",
    x: 500,  y: 565,  w: 210,  h: 210,  rot: 0.5,  z: 105 },

  // ── RIGHT CLUSTER ─────────────────────────────────────
  { id: "w-ponds",    src: "/Treatment Notes/ponds.png",         aspect: "16:9", pdf: "/Treatment Notes/Ponds  BB cream TN.pdf",
    x: 1010, y: 135,  w: 410,  h: 231,  rot: -1,   z: 115 },
  { id: "w-justbe",   src: "/Marketing Pitch/Just be.png",       aspect: "16:9", pdf: "/Marketing Pitch/Just Be.pdf",
    x: 1370, y: 155,  w: 350,  h: 197,  rot: 1,    z: 82 },
  { id: "w-pathan-1", src: "/Movie - OTT pitches/Pathan 1.png",  aspect: "4:5",  pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf",
    x: 960,  y: 310,  w: 255,  h: 319,  rot: 1.5,  z: 72 },
  { id: "w-godrej",   src: "/Treatment Notes/godrej.png",        aspect: "4:3",  pdf: "/Treatment Notes/Godrej Capital - Director_s Note.pdf",
    x: 1230, y: 320,  w: 310,  h: 233,  rot: -1.5, z: 92 },
  { id: "w-oool",     src: "/Marketing Pitch/oool.png",          aspect: "4:3",  pdf: "/Marketing Pitch/OOOL Digital Strategy.pdf",
    x: 1490, y: 290,  w: 280,  h: 210,  rot: 1.5,  z: 108 },
  { id: "w-deva",     src: "/Marketing Pitch/Deva.png",          aspect: "4:5",  pdf: "/Marketing Pitch/Deva_s Khayal.pdf",
    x: 1090, y: 510,  w: 230,  h: 288,  rot: -0.5, z: 50 },
  { id: "w-pathan-2", src: "/Movie - OTT pitches/Pathan 2.png",  aspect: "3:4",  pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf",
    x: 1330, y: 495,  w: 235,  h: 313,  rot: 0.5,  z: 78 },
  { id: "w-bubbling", src: "/Marketing Pitch/the.png",           aspect: "4:5",  pdf: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf",
    x: 1550, y: 505,  w: 240,  h: 300,  rot: -2,   z: 45 },

  // ── BOTTOM SCATTER ────────────────────────────────────
  { id: "w-murgi-1",  src: "/Movie - OTT pitches/Murgi.png",     aspect: "4:5",  pdf: "/Movie - OTT pitches/Murgi.pdf",
    x: 440,  y: 590,  w: 240,  h: 300,  rot: 0,    z: 120 },
];

const CANVAS_W = 1800;

export default function ProductionWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [sectionH, setSectionH] = useState(0);

  useEffect(() => {
    const maxY = cards.reduce((m, c) => Math.max(m, c.y + c.h), 0);
    setSectionH(Math.max(window.innerHeight, maxY + 120));
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

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

      <div className="relative z-10 text-center pt-12 pb-6 pointer-events-none">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">Production Archive</p>
        <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">The Wall</h2>
      </div>

      <div
        className="relative mx-auto"
        style={{ width: CANVAS_W, maxWidth: "100%", minHeight: sectionH ? sectionH - 140 : "calc(100vh - 140px)" }}
      >
        {cards.map((card, i) => {
          const delay = Math.min(i * 0.07, 1.4);
          const origZ = card.z;
          return (
            <div
              key={card.id}
              className="absolute cursor-pointer"
              style={{
                left: `${(card.x / CANVAS_W) * 100}%`,
                width: card.w,
                height: card.h,
                zIndex: origZ,
                opacity: 0,
                animation: visible ? `cardEntrance 0.8s ease-out ${delay}s forwards` : "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.zIndex = "999"; }}
              onMouseLeave={(e) => { e.currentTarget.style.zIndex = String(origZ); }}
              onClick={() => handleClick(card.pdf, card.src)}
            >
              <div
                className="w-full h-full overflow-hidden"
                style={{
                  transform: `translateY(0) rotate(${card.rot}deg)`,
                  borderRadius: "8px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  transition: "transform 0.35s ease, box-shadow 0.35s ease, filter 0.35s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = `translateY(-6px) rotate(${card.rot}deg) scale(1.03)`;
                  el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.65)";
                  el.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = `translateY(0) rotate(${card.rot}deg)`;
                  el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
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
