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
  "totality": [],
  "hungama": [],
};

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function ThumbnailRow({ brands }: { brands: string[] }) {
  const thumbs = useMemo(() => {
    return brands
      .map((b) => {
        const entry = archiveData.find(
          (a) => a.brand.toLowerCase() === b.toLowerCase() && a.thumbnail
        );
        return entry ? { brand: b, thumb: entry.thumbnail } : null;
      })
      .filter(Boolean) as { brand: string; thumb: string }[];
  }, [brands]);

  if (thumbs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {thumbs.slice(0, 5).map((t, i) => (
        <div
          key={i}
          className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border border-charcoal/10"
        >
          <img
            src={t.thumb}
            alt={t.brand}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

export default function ProductionTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const sorted = [...experience].sort(
    (a, b) => (b.displayOrder || 0) - (a.displayOrder || 0)
  );

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-20 md:py-32 bg-cream-paper reveal"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <p className="font-geist font-[500] text-charcoal/50 uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
          Career
        </p>
        <h2 className="font-gelica font-[500] text-cocoa-ink leading-[1.08] mb-16 md:mb-20 lowercase"
          style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
          production timeline
        </h2>

        <div className="relative max-w-4xl">
          <div className="absolute left-[7px] md:left-[11px] top-0 bottom-0 w-px bg-charcoal/10" />

          {sorted.map((entry, i) => {
            const brands = houseBrandMap[entry.productionHouseId] || [];
            return (
              <div
                key={entry.id}
                className="relative pl-8 md:pl-12 pb-12 md:pb-16 last:pb-0"
                style={{
                  opacity: 0,
                  animation: `heroFade 0.6s ease ${i * 0.15}s forwards`,
                }}
              >
                <div className="absolute left-0 top-1 w-[15px] h-[15px] md:w-[23px] md:h-[23px] rounded-full border-2 border-cocoa-ink bg-cream-paper z-10" />

                <div className="bg-dew-drop rounded-xl px-6 py-5 md:px-8 md:py-6 border border-charcoal/5">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-2">
                    <span className="font-geist font-[500] text-cocoa-ink uppercase" style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
                      {formatDate(entry.startDate)} – {entry.endDate ? formatDate(entry.endDate) : "Present"}
                    </span>
                    <span className="hidden md:block text-charcoal/20">/</span>
                    <span className="font-geist font-[400] text-charcoal/50 uppercase" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
                      {phMap.get(entry.productionHouseId) || entry.productionHouseId}
                    </span>
                  </div>

                  <h3 className="font-gelica font-[500] text-cocoa-ink leading-[1.2]" style={{ fontSize: "clamp(20px, 2.2vw, 28px)" }}>
                    {entry.roleTitle}
                  </h3>

                  {entry.description && (
                    <p className="mt-2 font-geist font-[300] text-charcoal/60 leading-[1.5] max-w-xl" style={{ fontSize: "14px" }}>
                      {entry.description}
                    </p>
                  )}

                  <ThumbnailRow brands={brands} />

                  {brands.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {brands.map((b) => (
                        <span
                          key={b}
                          className="font-geist font-[400] text-charcoal/40 uppercase border border-charcoal/10 px-2 py-0.5 rounded-lg"
                          style={{ fontSize: "9px", letterSpacing: "0.1em" }}
                        >
                          {b}
                        </span>
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
