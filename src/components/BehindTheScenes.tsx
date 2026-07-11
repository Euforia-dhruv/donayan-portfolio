"use client";

import { useEffect, useRef } from "react";
import bts from "@/data/bts.json";

export default function BehindTheScenes() {
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

  if (!bts || bts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-cinema-black reveal"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-4">
          Archive
        </p>
        <h2 className="text-display md:text-hero font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white text-balance mb-12 md:mb-16">
          Behind the Scenes
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {bts.map((item, i) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded ${
                i === 0 ? "col-span-2 row-span-2" : ""
              } ${i === 3 ? "md:col-span-2" : ""}`}
              style={{
                opacity: 0,
                animation: `fadeInUp 0.5s ease ${i * 0.08}s forwards`,
                aspectRatio: i === 0 ? "auto" : "4/5",
              }}
            >
              <div className="aspect-[4/5] bg-charcoal flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-charcoal to-smoke flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <span className="text-heading-sm font-display font-[400] text-cinema-white/10">
                    {item.brand}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <div>
                    <p className="text-body-sm font-sans font-[500] text-cinema-white leading-[1]">
                      {item.projectName}
                    </p>
                    <p className="text-caption font-sans font-[400] text-champagne mt-1 uppercase tracking-[0.1em]">
                      {item.role} &middot; {item.year}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
