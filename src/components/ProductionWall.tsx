"use client";

import { useState, useRef, useEffect } from "react";

interface WallImage {
  id: string;
  src: string;
  aspect: string;
  title: string;
  pdf: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  z: number;
}

const allCards: WallImage[] = [
  // ── Row 1: hero landscapes + tall accent ──────────────────
  { id: "w-centrum",  src: "/PPM Decks/Centrum.png",              aspect: "16:9", title: "Centrum",        pdf: null,
    x: 30,  y: 150, w: 400, h: 225, rot: -1,   z: 50 },
  { id: "w-hdfc",     src: "/PPM Decks/HDFC.png",                 aspect: "16:9", title: "HDFC KVS",       pdf: "/PPM Decks/HDFC KVS Post PPM Deck.pdf",
    x: 370, y: 140, w: 440, h: 248, rot: 0.5,  z: 55 },
  { id: "w-murgi-2",  src: "/Movie - OTT pitches/Murgi 1.png",    aspect: "9:16", title: "Murgi",          pdf: "/Movie - OTT pitches/Murgi.pdf",
    x: 750, y: 128, w: 185, h: 329, rot: 1.5,  z: 60 },
  { id: "w-ponds",    src: "/Treatment Notes/ponds.png",          aspect: "16:9", title: "Ponds BB Cream", pdf: "/Treatment Notes/Ponds  BB cream TN.pdf",
    x: 880, y: 135, w: 420, h: 236, rot: -1,   z: 45 },
  { id: "w-justbe",   src: "/Marketing Pitch/Just be.png",        aspect: "16:9", title: "Just Be",        pdf: "/Marketing Pitch/Just Be.pdf",
    x: 1260, y: 155, w: 360, h: 203, rot: 1,   z: 52 },

  // ── Row 1.5: accent portrait between rows 1 and 2 ───────
  { id: "w-tanishq",  src: "/Others/Tanishq.png",                 aspect: "3:4",  title: "Tanishq",        pdf: "/Others/Tanishq Casting.pdf",
    x: 60,  y: 285, w: 220, h: 293, rot: 0.5,  z: 42 },

  // ── Row 2: landscape cards ──────────────────────────────
  { id: "w-sprite",   src: "/PPM Decks/Sprite.png",               aspect: "4:3",  title: "Sprite",         pdf: null,
    x: 210, y: 325, w: 340, h: 255, rot: -1,   z: 48 },
  { id: "w-idee",     src: "/PPM Decks/IDEE.png",                 aspect: "4:3",  title: "IDEE",           pdf: "/PPM Decks/IDEE PPM.pdf",
    x: 580, y: 315, w: 360, h: 270, rot: 0.5,  z: 53 },
  { id: "w-godrej",   src: "/Treatment Notes/godrej.png",          aspect: "4:3",  title: "Godrej Capital", pdf: "/Treatment Notes/Godrej Capital - Director_s Note.pdf",
    x: 980, y: 325, w: 340, h: 255, rot: -0.5, z: 44 },
  { id: "w-oool",     src: "/Marketing Pitch/oool.png",           aspect: "4:3",  title: "OOOL Digital",   pdf: "/Marketing Pitch/OOOL Digital Strategy.pdf",
    x: 1370, y: 310, w: 340, h: 255, rot: 1.5,  z: 50 },

  // ── Row 2.5: portrait accent cards ──────────────────────
  { id: "w-ax",       src: "/PPM Decks/AX.png",                   aspect: "4:5",  title: "AX",             pdf: "/PPM Decks/AX Celebrity Shoot SS_25.pdf",
    x: 120, y: 445, w: 230, h: 288, rot: 1,    z: 46 },
  { id: "w-artkalaa", src: "/Marketing Pitch/artkalaa.png",       aspect: "4:5",  title: "Artkalaa",       pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",
    x: 380, y: 450, w: 235, h: 294, rot: -1.5, z: 43 },
  { id: "w-kinder",   src: "/PPM Decks/Kinder.png",               aspect: "3:4",  title: "Kinder",         pdf: "/PPM Decks/Kinder Print Shoot.pdf",
    x: 640, y: 440, w: 220, h: 293, rot: 0.5,  z: 49 },
  { id: "w-kitser",   src: "/Marketing Pitch/kister.png",         aspect: "3:4",  title: "Kitser",         pdf: "/Marketing Pitch/Kitser August Sale.pdf",
    x: 880, y: 435, w: 225, h: 300, rot: -1,   z: 41 },
  { id: "w-pathan-2", src: "/Movie - OTT pitches/Pathan 2.png",   aspect: "3:4",  title: "Pathan Bros",    pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf",
    x: 1130, y: 445, w: 225, h: 300, rot: 0.5,  z: 47 },
  { id: "w-deva",     src: "/Marketing Pitch/Deva.png",           aspect: "4:5",  title: "Deva",           pdf: "/Marketing Pitch/Deva_s Khayal.pdf",
    x: 1380, y: 440, w: 225, h: 281, rot: -0.5, z: 40 },

  // ── Row 3: bottom cluster ──────────────────────────────
  { id: "w-fossil",   src: "/Treatment Notes/fossil.png",          aspect: "4:5",  title: "Fossil",         pdf: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf",
    x: 60,  y: 590, w: 235, h: 294, rot: -1.5, z: 38 },
  { id: "w-lifestyle", src: "/Others/life.png",                   aspect: "4:3",  title: "Lifestyle",      pdf: "/Others/Lifestyle SS_24 Cast Batch 5 (Bangkok).pdf",
    x: 320, y: 595, w: 320, h: 240, rot: 0.5,  z: 44 },
  { id: "w-bubbling", src: "/Marketing Pitch/the.png",            aspect: "4:5",  title: "The Bubbling Fish", pdf: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf",
    x: 670, y: 580, w: 235, h: 294, rot: 1,    z: 39 },
  { id: "w-murgi-1",  src: "/Movie - OTT pitches/Murgi.png",      aspect: "4:5",  title: "Murgi",          pdf: "/Movie - OTT pitches/Murgi.pdf",
    x: 930, y: 590, w: 230, h: 288, rot: -0.5, z: 42 },
  { id: "w-pathan-1", src: "/Movie - OTT pitches/Pathan 1.png",   aspect: "4:5",  title: "Pathan Bros",    pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf",
    x: 1190, y: 585, w: 240, h: 300, rot: 1.5,  z: 46 },
  { id: "w-artkalaa-2", src: "/Marketing Pitch/artkalaa 2.png",   aspect: "1:1",  title: "Artkalaa",       pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",
    x: 1460, y: 600, w: 200, h: 200, rot: -1,   z: 37 },
];

const CANVAS_W = 1800;

export default function ProductionWall() {
  const [visible, setVisible] = useState(false);
  const [sectionH, setSectionH] = useState(0);

  useEffect(() => {
    const maxY = allCards.reduce((m, c) => Math.max(m, c.y + c.h), 0);
    setSectionH(maxY + 80);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const handleClick = (pdf: string | null) => {
    if (pdf) window.open(pdf, "_blank");
  };

  return (
    <section
      className="w-full relative"
      style={{ backgroundColor: "#0b0b0b" }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        opacity: 0.035,
      }} />

      <div className="relative z-10 text-center pt-10 pb-4 pointer-events-none">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">Production Archive</p>
        <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">The Wall</h2>
      </div>

      <div
        className="relative mx-auto"
        style={{ width: CANVAS_W, maxWidth: "100%", height: sectionH }}
      >
        {allCards.map((card, i) => {
          const delay = Math.min(i * 0.1, 1.0);
          return (
            <div
              key={card.id}
              className="absolute cursor-pointer"
              style={{
                left: `${(card.x / CANVAS_W) * 100}%`,
                top: card.y,
                width: card.w,
                height: card.h,
                zIndex: card.z,
                opacity: 0,
                animation: visible ? `cardEntrance 0.7s ease-out ${delay}s forwards` : "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.zIndex = "999"; }}
              onMouseLeave={(e) => { e.currentTarget.style.zIndex = String(card.z); }}
              onClick={() => handleClick(card.pdf)}
            >
              <div
                className="w-full h-full overflow-hidden group relative"
                style={{
                  transform: `rotate(${card.rot}deg)`,
                  borderRadius: "18px",
                  boxShadow: "0 6px 28px rgba(0,0,0,0.55)",
                  transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s ease, filter 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = `rotate(${card.rot}deg) scale(1.04)`;
                  el.style.boxShadow = "0 16px 56px rgba(0,0,0,0.75)";
                  el.style.filter = "brightness(1.1)";
                  const ov = el.querySelector<HTMLElement>(".wall-overlay");
                  const ti = el.querySelector<HTMLElement>(".wall-title");
                  if (ov) ov.style.opacity = "1";
                  if (ti) { ti.style.opacity = "1"; ti.style.transform = "translateY(0)"; }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = `rotate(${card.rot}deg)`;
                  el.style.boxShadow = "0 6px 28px rgba(0,0,0,0.55)";
                  el.style.filter = "brightness(1)";
                  const ov = el.querySelector<HTMLElement>(".wall-overlay");
                  const ti = el.querySelector<HTMLElement>(".wall-title");
                  if (ov) ov.style.opacity = "0";
                  if (ti) { ti.style.opacity = "0"; ti.style.transform = "translateY(6px)"; }
                }}
              >
                <img
                  src={card.src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={{ display: "block", borderRadius: "18px" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none wall-overlay"
                  style={{
                    borderRadius: "18px",
                    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 50%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none px-5 pb-5 wall-title"
                  style={{
                    opacity: 0,
                    transform: "translateY(6px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                  }}
                >
                  <p className="text-body-sm font-switzer font-[400] text-cinema-white/90">
                    {card.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
