"use client";

import { useEffect, useRef, useMemo } from "react";
import experience from "@/data/experience.json";
import productionHouses from "@/data/production-houses.json";
import archiveData from "@/data/archive.json";

const phMap = new Map(productionHouses.map((ph) => [ph.id, ph.name]));

const houseBrandMap: Record<string, string[]> = {
  "pink-flower": ["Pink Flower"],
  "twism": ["Sprite", "Centrum", "Fossil", "Armani Exchange", "Tanishq", "Godrej Capital", "IDÉE", "Kinder", "Pink Flower"],
  "the-glitch": ["Lakmé", "Dove", "Budweiser", "Titan", "HDFC", "The Bear House", "Pronamel"],
  "totality": [], "hungama": [],
};

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function ThumbnailRow({ brands }: { brands: string[] }) {
  const thumbs = useMemo(() => brands.map((b) => { const e = archiveData.find((a) => a.brand.toLowerCase() === b.toLowerCase() && a.thumbnail); return e ? { brand: b, thumb: e.thumbnail } : null; }).filter(Boolean) as { brand: string; thumb: string }[], [brands]);
  if (thumbs.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {thumbs.slice(0, 5).map((t, i) => (
        <div key={i} className="w-14 h-14 md:w-16 md:h-16 overflow-hidden border border-cinema-white/6"><img src={t.thumb} alt={t.brand} className="w-full h-full object-cover" loading="lazy" /></div>
      ))}
    </div>
  );
}

export default function ProductionTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  const sorted = [...experience].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <section id="process" ref={sectionRef} className="py-10 md:py-14 bg-cinema-black reveal">
      <div className="max-w-[1400px] mx-auto px-8 md:px-10">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-4">Career</p>
        <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] mb-10 md:mb-12">Production Timeline</h2>

        <div className="relative max-w-4xl">
          <div className="absolute left-[7px] md:left-[11px] top-0 bottom-0 w-px bg-cinema-white/8" />

          {sorted.map((entry, i) => {
            const brands = houseBrandMap[entry.productionHouseId] || [];
            return (
              <div key={entry.id} className="relative pl-8 md:pl-12 pb-8 md:pb-10 last:pb-0"
                style={{ opacity: 0, animation: `heroFade 0.6s ease ${i * 0.15}s forwards` }}>
                <div className="absolute left-0 top-1 w-[15px] h-[15px] md:w-[23px] md:h-[23px] rounded-full bg-gold border-2 border-gold z-10" />

                <div className="border border-cinema-white/6 px-6 py-5 md:px-8 md:py-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-2">
                    <span className="text-caption font-switzer font-[500] text-stone uppercase tracking-[0.02em]">{formatDate(entry.startDate)} – {entry.endDate ? formatDate(entry.endDate) : "Present"}</span>
                    <span className="hidden md:block text-cinema-white/25">/</span>
                    <span className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">{phMap.get(entry.productionHouseId) || entry.productionHouseId}</span>
                  </div>

                  <h3 className="text-heading-sm md:text-heading font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.02em]">{entry.roleTitle}</h3>

                  {entry.description && <p className="mt-2 text-body-sm font-switzer font-[300] text-stone leading-[1.5] max-w-xl">{entry.description}</p>}

                  <ThumbnailRow brands={brands} />

                  {brands.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {brands.map((b) => (
                        <span key={b} className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] border border-cinema-white/8 px-2 py-0.5">{b}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
