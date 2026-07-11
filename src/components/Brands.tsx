"use client";

import { useEffect, useRef } from "react";
import brands from "@/data/brands.json";

export default function Brands() {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden reveal border-t border-cinema-white/8 bg-cinema-black"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-10 mb-8">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">
          Trusted by
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #0A0A0A 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #0A0A0A 0%, transparent 100%)" }} />

        <div className="flex gap-12 md:gap-16 marquee-animate" style={{ width: "max-content" }}>
          {[...brands, ...brands].map((brand, i) => (
            <div key={`${brand.id}-${i}`} className="flex-shrink-0 flex items-center justify-center group">
              <span className="text-body-sm font-switzer font-[400] text-cinema-white/25 uppercase tracking-[0.02em] whitespace-nowrap group-hover:text-cinema-white transition-colors duration-500 cursor-default">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
