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
      className="py-20 md:py-32 bg-cream-paper border-t border-charcoal/10 reveal"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <p className="font-geist font-[500] text-charcoal/50 uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
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
              <p className="font-gelica font-[500] text-cocoa-ink leading-[1.08] text-balance lowercase"
                style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-6 font-geist font-[400] text-charcoal/50 uppercase" style={{ fontSize: "12px", letterSpacing: "0.1em" }}>
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
              className={`transition-all duration-300 cursor-pointer border-none rounded-full ${
                i === active ? "bg-charcoal" : "bg-charcoal/20"
              }`}
              style={{ width: i === active ? "24px" : "8px", height: "8px" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
