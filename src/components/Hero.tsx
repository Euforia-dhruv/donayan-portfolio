"use client";

import { useEffect, useRef } from "react";
import siteContent from "@/data/site-content.json";

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 1.2s ease, transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    setTimeout(() => {
      el.style.transition = "opacity 1s ease, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 800);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-cinema-black"
    >
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: "url('')",
          backgroundColor: "#0B0B0B",
          backgroundBlendMode: "overlay",
          animation: "scaleIn 8s ease-out forwards",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/80 via-cinema-black/40 to-cinema-black/60" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-20">
        <div className="max-w-4xl">
          <p
            className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-6"
            style={{
              opacity: 0,
              animation: "fadeIn 1s ease 0.3s forwards",
            }}
          >
            Director&apos;s Assistant & Associate Producer
          </p>

          <h1
            ref={titleRef}
            className="text-hero md:text-[96px] lg:text-[120px] font-display font-[400] leading-[0.9] tracking-[-0.05em] text-cinema-white text-balance"
          >
            DONAYAN
            <br />
            SAHDEV
          </h1>

          <p
            className="mt-6 text-lead md:text-xl font-sans font-[300] text-cinema-white/70 leading-[1.5] max-w-xl"
            style={{
              opacity: 0,
              animation: "fadeIn 1s ease 0.6s forwards",
            }}
          >
            {siteContent.hero.introLine}
          </p>

          <div
            style={{
              opacity: 0,
              animation: "fadeInUp 0.8s ease 1s forwards",
            }}
            className="mt-10"
          >
            <a
              href="#work"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-champagne text-champagne text-body-sm font-sans font-[500] no-underline uppercase tracking-[0.15em] rounded hover:bg-champagne/10 transition-all duration-500 gold-glow"
            >
              {siteContent.hero.ctaPrimary}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-champagne">
                <path d="M3 8h10M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-20 md:mt-32"
        >
          {siteContent.hero.stats.map((stat) => (
            <div key={stat.label} className="glass rounded px-5 py-4">
              <p className="text-heading-sm md:text-heading font-display font-[400] text-champagne leading-[1]">
                {stat.value}
              </p>
              <p className="text-caption font-sans font-[400] text-cinema-white/50 uppercase tracking-[0.1em] mt-1.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 scroll-indicator">
        <span className="text-caption font-sans font-[400] text-cinema-white/40 uppercase tracking-[0.2em]">
          Scroll
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-cinema-white/30">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
