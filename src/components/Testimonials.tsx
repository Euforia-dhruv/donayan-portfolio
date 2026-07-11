"use client";

import { useEffect, useRef, useState } from "react";
import siteContent from "@/data/site-content.json";

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % siteContent.testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!siteContent.testimonials || siteContent.testimonials.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-cinema-black border-t border-white/5 reveal"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-4">
          Testimonials
        </p>

        <div className="max-w-4xl">
          {siteContent.testimonials.map((t, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${
                i === active
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 absolute"
              }`}
              style={i === active ? { position: "relative" } : {}}
            >
              <p className="text-heading-lg md:text-display font-display font-[400] text-cinema-white leading-[1.1] tracking-[-0.03em] text-balance">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-6 text-body-sm font-sans font-[400] text-cinema-white/50 uppercase tracking-[0.1em]">
                — {t.attribution}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-10">
          {siteContent.testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer border-none ${
                i === active ? "bg-champagne w-8" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
