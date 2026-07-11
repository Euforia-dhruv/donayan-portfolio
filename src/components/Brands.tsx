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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="py-20 md:py-28 bg-cinema-black border-t border-white/5 overflow-hidden reveal"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-10">
        <p className="text-caption font-sans font-[500] text-cinema-white/40 uppercase tracking-[0.2em]">
          Brands & Partners
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-16 marquee-animate" style={{ width: "max-content" }}>
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center px-8"
            >
              <span className="text-heading-sm md:text-heading font-sans font-[200] text-cinema-white/20 uppercase tracking-[0.1em] whitespace-nowrap hover:text-cinema-white/40 transition-colors duration-500">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
