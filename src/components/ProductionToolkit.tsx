"use client";

import { useEffect, useRef } from "react";
import toolkit from "@/data/toolkit.json";

export default function ProductionToolkit() {
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

  return (
    <section
      id="toolkit"
      ref={sectionRef}
      className="py-20 md:py-28 bg-cinema-black reveal"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-4">
          Expertise
        </p>
        <h2 className="text-display md:text-hero font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white text-balance mb-12 md:mb-16">
          Production Toolkit
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {toolkit.map((item, i) => (
            <div
              key={item.id}
              className="group glass rounded px-5 py-6 md:px-6 md:py-8 hover:bg-white/5 transition-all duration-500 cursor-default"
              style={{
                opacity: 0,
                animation: `fadeInUp 0.5s ease ${i * 0.05}s forwards`,
              }}
            >
              <span className="text-caption font-sans font-[400] text-cinema-white/20 tracking-[0.1em]">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-body-sm md:text-lead font-sans font-[400] text-cinema-white leading-[1.3] group-hover:text-champagne transition-colors duration-300">
                {item.name}
              </h3>
              <p className="mt-2 text-caption font-sans font-[300] text-cinema-white/30 leading-[1.4] group-hover:text-cinema-white/50 transition-colors duration-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
