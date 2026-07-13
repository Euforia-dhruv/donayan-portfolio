"use client";

import { useEffect, useRef, useState } from "react";
import { getMediaUrl } from "@/lib/media";

interface WallCard {
  id: string;
  src: string;
  title: string;
  pdf: string | null;
  w: number;
  h: number;
}

const allCards: WallCard[] = [
  { id: "w-centrum",  src: "/ppm-decks/Centrum.png",              title: "Centrum",        pdf: null,                                              w: 400, h: 225 },
  { id: "w-hdfc",     src: "/ppm-decks/HDFC.png",                 title: "HDFC KVS",       pdf: "/PPM Decks/HDFC KVS Post PPM Deck.pdf",           w: 440, h: 248 },
  { id: "w-murgi-2",  src: "/movie-ott-pitches/Murgi 1.png",      title: "Murgi",          pdf: "/Movie - OTT pitches/Murgi.pdf",                  w: 185, h: 329 },
  { id: "w-ponds",    src: "/treatment-notes/ponds.png",          title: "Ponds BB Cream", pdf: "/Treatment Notes/Ponds  BB cream TN.pdf",         w: 420, h: 236 },
  { id: "w-justbe",   src: "/marketing-pitch/Just be.png",        title: "Just Be",        pdf: "/Marketing Pitch/Just Be.pdf",                    w: 360, h: 203 },
  { id: "w-tanishq",  src: "/others/Tanishq.png",                 title: "Tanishq",        pdf: "/Others/Tanishq Casting.pdf",                     w: 220, h: 293 },
  { id: "w-sprite",   src: "/ppm-decks/Sprite.png",               title: "Sprite",         pdf: null,                                              w: 340, h: 255 },
  { id: "w-idee",     src: "/ppm-decks/IDEE.png",                 title: "IDEE",           pdf: "/PPM Decks/IDEE PPM.pdf",                        w: 360, h: 270 },
  { id: "w-godrej",   src: "/treatment-notes/godrej.png",          title: "Godrej Capital", pdf: "/Treatment Notes/Godrej Capital - Director_s Note.pdf", w: 340, h: 255 },
  { id: "w-oool",     src: "/marketing-pitch/oool.png",           title: "OOOL Digital",   pdf: "/Marketing Pitch/OOOL Digital Strategy.pdf",      w: 340, h: 255 },
  { id: "w-ax",       src: "/ppm-decks/AX.png",                   title: "AX",             pdf: "/PPM Decks/AX Celebrity Shoot SS_25.pdf",         w: 230, h: 288 },
  { id: "w-artkalaa", src: "/marketing-pitch/artkalaa.png",       title: "Artkalaa",       pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",        w: 235, h: 294 },
  { id: "w-kinder",   src: "/ppm-decks/Kinder.png",               title: "Kinder",         pdf: "/PPM Decks/Kinder Print Shoot.pdf",               w: 220, h: 293 },
  { id: "w-kitser",   src: "/marketing-pitch/kister.png",         title: "Kitser",         pdf: "/Marketing Pitch/Kitser August Sale.pdf",         w: 225, h: 300 },
  { id: "w-pathan-2", src: "/movie-ott-pitches/Pathan 2.png",     title: "Pathan Bros",    pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf", w: 225, h: 300 },
  { id: "w-deva",     src: "/marketing-pitch/Deva.png",           title: "Deva",           pdf: "/Marketing Pitch/Deva_s Khayal.pdf",              w: 225, h: 281 },
  { id: "w-fossil",   src: "/treatment-notes/fossil.png",          title: "Fossil",         pdf: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf",  w: 235, h: 294 },
  { id: "w-lifestyle", src: "/others/life.png",                   title: "Lifestyle",      pdf: "/Others/Lifestyle SS_24 Cast Batch 5 (Bangkok).pdf", w: 320, h: 240 },
  { id: "w-bubbling", src: "/marketing-pitch/the.png",            title: "The Bubbling Fish", pdf: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf", w: 235, h: 294 },
  { id: "w-murgi-1",  src: "/movie-ott-pitches/Murgi.png",        title: "Murgi",          pdf: "/Movie - OTT pitches/Murgi.pdf",                  w: 230, h: 288 },
  { id: "w-pathan-1", src: "/movie-ott-pitches/Pathan 1.png",     title: "Pathan Bros",    pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf", w: 240, h: 300 },
  { id: "w-artkalaa-2", src: "/marketing-pitch/artkalaa 2.png",   title: "Artkalaa",       pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",        w: 200, h: 200 },
];

function WallCard({ card }: { card: WallCard }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    const onLoad = () => setLoaded(true);
    const onError = () => { setErrored(true); };
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    if (errored) {
      console.debug(`[Wall] Removed: ${card.title} (${card.src})`);
    }
  }, [errored, card]);

  if (errored) return null;

  return (
    <div
      className="group break-inside-avoid mb-5"
      style={{
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{
          borderRadius: "20px",
          backgroundColor: "#141414",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.5)"
            : "0 2px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (card.pdf) window.open(card.pdf, "_blank");
        }}
      >
        {!loaded && (
          <div
            className="w-full bg-[#1a1a1a] animate-pulse"
            style={{ aspectRatio: `${card.w} / ${card.h}` }}
          />
        )}

        <img
          ref={imgRef}
          src={getMediaUrl(card.src)}
          alt={card.title}
          className={`w-full h-auto align-middle ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500 group-hover:scale-[1.03]`}
          style={{
            display: "block",
            transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.25,0.1,0.25,1)",
          }}
          loading="lazy"
        />

        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-400"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 70%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none p-5"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <p className="text-body-sm font-switzer font-[400] text-cinema-white">
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
  const sectionRef = useRef<HTMLElement>(null);
  const [validCards, setValidCards] = useState<WallCard[]>([]);

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
    const checkImages = async () => {
      const results: WallCard[] = [];
      for (const card of allCards) {
        try {
          const url = getMediaUrl(card.src);
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) results.push(card);
          else console.debug(`[Wall] Missing: ${card.title} (${url})`);
        } catch {
          console.debug(`[Wall] Error: ${card.title} (${card.src})`);
        }
      }
      setValidCards(results);
      setReady(true);
    };
    checkImages();
  }, [visible]);

  return (
    <section
      id="wall"
      ref={sectionRef}
      className="w-full relative py-20 bg-cinema-black"
      aria-label="Production Archive Wall"
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        opacity: 0.035,
      }} />

      <div className="relative z-10 max-w-[1500px] mx-auto px-8 md:px-10">
        <div className="text-center mb-12">
          <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">
            Production Archive
          </p>
          <h2 className="font-switzer font-[300] leading-[1] tracking-[-0.03em] mt-3"
            style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}>
            The Wall
          </h2>
        </div>

        {!ready && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-5">
                <div
                  className="w-full bg-[#1a1a1a] animate-pulse"
                  style={{
                    borderRadius: "20px",
                    aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/3" : "1/1",
                  }}
                />
              </div>
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
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            {validCards.map((card, i) => (
              <WallCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
