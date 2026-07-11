"use client";

import { useRef, useEffect } from "react";
import siteContent from "@/data/site-content.json";

export default function AboutSection() {
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
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-36 overflow-hidden reveal bg-dew-drop"
    >
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <div className="lg:col-span-3">
            <p className="font-geist font-[500] text-charcoal/50 uppercase mb-4 reveal reveal-delay-1" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
              About
            </p>
            <h2 className="font-gelica font-[500] text-cocoa-ink leading-[1.08] max-w-2xl mb-8 reveal reveal-delay-2 lowercase"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
              {siteContent.about.title}
            </h2>
            <div className="space-y-4 reveal reveal-delay-3">
              {siteContent.about.body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="font-geist font-[300] text-charcoal/70 leading-[1.7] max-w-2xl"
                  style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-8 reveal reveal-delay-4">
              <img
                src="/hero-bg.jpg"
                alt="On set production"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="font-geist font-[400] text-cream-paper/60 uppercase" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                  On Set · Director's Monitor
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 reveal reveal-delay-5">
              {siteContent.about.stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-gelica font-[500] text-cocoa-ink leading-[1]" style={{ fontSize: "clamp(28px, 3vw, 36px)" }}>
                    {stat.value}
                  </p>
                  <p className="font-geist font-[400] text-charcoal/50 uppercase mt-1" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
