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
      className="relative py-24 md:py-36 overflow-hidden reveal bg-cinema-black"
    >
      {/* Background with production set imagery */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
              linear-gradient(180deg, #0B0B0B 0%, #111112 50%, #0B0B0B 100%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          {/* Text content */}
          <div className="lg:col-span-3">
            <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-4 reveal reveal-delay-1">
              About
            </p>
            <h2 className="text-display md:text-heading-lg font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white max-w-2xl mb-8 reveal reveal-delay-2">
              {siteContent.about.title}
            </h2>
            <div className="space-y-4 reveal reveal-delay-3">
              {siteContent.about.body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-body md:text-lead font-sans font-[300] text-cinema-white/60 leading-[1.7] max-w-2xl"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Stats + set image */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            {/* BTS production still */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-8 reveal reveal-delay-4">
              <img
                src="/hero-bg.jpg"
                alt="On set production"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[9px] font-sans font-[400] text-cinema-white/50 uppercase tracking-[0.15em]">
                  On Set · Director's Monitor
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6 reveal reveal-delay-5">
              {siteContent.about.stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-heading-sm md:text-heading font-display font-[400] text-champagne leading-[1]">
                    {stat.value}
                  </p>
                  <p className="text-caption font-sans font-[400] text-cinema-white/40 uppercase tracking-[0.1em] mt-1">
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
