"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface WallImage {
  id: string;
  src: string;
  aspect: string;
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

function shuffle(arr: WallImage[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ImageCard({ img, index, onSelect }: { img: WallImage; index: number; onSelect: (src: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const delay = Math.min(index * 0.06, 1.5);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.unobserve(el);
        }
      },
      { rootMargin: "80px", threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="break-inside-avoid mb-6 group cursor-pointer"
      style={{
        opacity: 0,
        transform: "translateY(40px)",
        transition: `opacity 0.7s ease, transform 0.7s ease`,
        transitionDelay: `${delay}s`,
      }}
      onClick={() => onSelect(img.src)}
    >
      <div className="relative w-full overflow-hidden bg-smoke" style={{ aspectRatio: img.aspect }}>
        <img
          src={img.src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-cinema-black/0 group-hover:bg-cinema-black/30 transition-all duration-300" />
      </div>
    </div>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cinema-black/95 backdrop-blur-xl cursor-pointer"
      onClick={handleClick}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-cinema-white/50 hover:text-cinema-white text-xl bg-transparent border-none cursor-pointer z-10 transition-colors"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="" className="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>
  );
}

export default function ProductionWall() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [items] = useState(() => shuffle(images));
  const handleClose = useCallback(() => setLightboxSrc(null), []);

  return (
    <>
      <section className="py-24 md:py-32 bg-cinema-black">
        <div className="max-w-[1440px] mx-auto px-8 md:px-10">
          <div className="mb-14 md:mb-18">
            <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">Production Archive</p>
            <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">The Wall</h2>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6" style={{ columnFill: "balance" }}>
            {items.map((img, i) => (
              <ImageCard key={img.id} img={img} index={i} onSelect={setLightboxSrc} />
            ))}
          </div>
        </div>
      </section>

      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={handleClose} />}
    </>
  );
}
