"use client";

import { useState, useCallback, useEffect, useRef } from "react";

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cinema-black/95 backdrop-blur-xl cursor-pointer"
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-cinema-white/50 hover:text-cinema-white bg-transparent border-none cursor-pointer z-10 transition-colors">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {currentIndex > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-cinema-white/50 hover:text-cinema-white bg-transparent border-none cursor-pointer z-10 transition-colors p-2"
          aria-label="Previous">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-cinema-white/50 hover:text-cinema-white bg-transparent border-none cursor-pointer z-10 transition-colors p-2"
          aria-label="Next">
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

export default function ProductionWall() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [items] = useState(() => shuffle(images));
  const handleClose = useCallback(() => setLightboxIndex(null), []);

  return (
    <>
      <section className="py-24 md:py-32 bg-cinema-black">
        <div className="max-w-[1440px] mx-auto px-8 md:px-10">
          <div className="mb-14">
            <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">Production Archive</p>
            <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">The Wall</h2>
          </div>

          <div className="columns-2 md:columns-3 xl:columns-5" style={{ columnGap: "24px", columnFill: "auto" }}>
            {items.map((img, i) => (
              <div key={img.id} className="break-inside-avoid mb-6 group cursor-pointer" onClick={() => setLightboxIndex(i)}>
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: img.aspect, borderRadius: "10px", backgroundColor: "#1a1a1a" }}>
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-[1.03]"
                    style={{ display: "block", borderRadius: "10px" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-cinema-black/0 group-hover:bg-cinema-black/30 transition-all duration-300" style={{ borderRadius: "10px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={items}
          currentIndex={lightboxIndex}
          onClose={handleClose}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
