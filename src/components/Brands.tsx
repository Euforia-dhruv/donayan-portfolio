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
      id="work"
      ref={sectionRef}
      className="relative py-16 md:py-20 overflow-hidden reveal"
      style={{ background: "#050505" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-8">
        <p className="text-[10px] font-sans font-[500] text-white/30 uppercase tracking-[0.28em]">
          Donayan Sahdev
        </p>
        <h2 className="text-[11px] font-sans font-[400] text-white/15 uppercase tracking-[0.25em] mt-1">
          Trusted by
        </h2>
      </div>

      <div className="relative overflow-hidden">
        {/* gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #050505 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #050505 0%, transparent 100%)" }} />

        <div className="flex gap-12 md:gap-16 marquee-animate" style={{ width: "max-content" }}>
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center group"
            >
              <span className="text-[13px] md:text-[15px] font-sans font-[400] text-white/15 uppercase tracking-[0.15em] whitespace-nowrap group-hover:text-champagne group-hover:tracking-[0.2em] transition-all duration-500 cursor-default"
                style={{ transitionTimingFunction: "cubic-bezier(0.25,0.46,0.45,0.94)" }}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
