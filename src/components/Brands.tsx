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
      className="relative py-16 md:py-20 overflow-hidden reveal border-t border-charcoal/10"
      style={{ background: "#fdfbf9" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 mb-8">
        <p className="font-geist font-[400] text-charcoal/50 lowercase" style={{ fontSize: "14px" }}>
          trusted by
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #fdfbf9 0%, transparent 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(-90deg, #fdfbf9 0%, transparent 100%)" }} />

        <div className="flex gap-12 md:gap-16 marquee-animate" style={{ width: "max-content" }}>
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className="flex-shrink-0 flex items-center justify-center group"
            >
              <span className="font-geist font-[400] text-charcoal/30 uppercase whitespace-nowrap group-hover:text-cocoa-ink transition-all duration-500 cursor-default"
                style={{ fontSize: "13px", letterSpacing: "0.05em" }}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
