"use client";

import { useEffect, useRef } from "react";

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
      el.style.setProperty("--scroll-progress", `${progress}`);
    };

    const onMouse = (e: MouseEvent) => {
      if (!glowRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      glowRef.current.style.background = `radial-gradient(600px at ${x}% ${y}%, rgba(212,175,55,0.06) 0%, transparent 70%)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-cinema-black"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 scale-[1.08]"
        style={{
          animation: "scaleIn 20s ease-out forwards",
        }}
      >
        <img
          src="/hero-bg.jpg"
          alt="Donayan Sahdev on set"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/70 to-cinema-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black/80 via-transparent to-cinema-black/60" />
      </div>

      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = 2 + Math.random() * 3;
        const x = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 6 + Math.random() * 8;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-cinema-white/20"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              bottom: "-10px",
              animation: `particle ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}

      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-10 pt-28 pb-16">
        <div className="max-w-3xl">
          <p
            className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.25em] mb-6"
            style={{ animation: "fadeIn 1s ease 0.3s forwards", opacity: 0 }}
          >
            Director&apos;s Assistant & Associate Producer
          </p>

          <h1 className="text-cinema-white text-balance">
            <span className="hero-text-line"><span className="text-hero md:text-[110px] lg:text-[130px] font-display font-[400] leading-[0.85] tracking-[-0.05em]">DONAYAN</span></span>
            <span className="hero-text-line"><span className="text-hero md:text-[110px] lg:text-[130px] font-display font-[400] leading-[0.85] tracking-[-0.05em]">SAHDEV</span></span>
          </h1>

          <div className="mt-6 space-y-1">
            <p className="text-lead md:text-xl font-sans font-[300] text-cinema-white/60 tracking-[0.02em] hero-text-line">
              <span>Commercial Advertising · Fashion · Celebrity Campaigns · Music Videos</span>
            </p>
          </div>

          <p
            className="mt-6 text-body md:text-lead font-sans font-[300] text-cinema-white/50 leading-[1.6] max-w-xl tracking-[0.02em]"
            style={{ animation: "fadeIn 1s ease 0.9s forwards", opacity: 0 }}
          >
            Helping directors transform creative vision into flawlessly executed productions
            <br />across India&apos;s biggest brands and agencies.
          </p>

          <div
            style={{ animation: "fadeInUp 0.8s ease 1.2s forwards", opacity: 0 }}
            className="mt-10"
          >
            <a
              href="#wall"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-champagne/60 text-champagne text-body-sm font-sans font-[500] no-underline uppercase tracking-[0.2em] rounded hover:bg-champagne/10 transition-all duration-500"
            >
              Explore Production Log
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-champagne">
                <path d="M3 8h10M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div
            className="flex flex-wrap gap-6 md:gap-10 mt-12"
            style={{ animation: "fadeIn 1s ease 1.5s forwards", opacity: 0 }}
          >
            <div>
              <p className="text-heading-sm font-display font-[400] text-champagne leading-[1]">60+</p>
              <p className="text-caption font-sans font-[400] text-cinema-white/40 uppercase tracking-[0.15em] mt-1">Commercial Productions</p>
            </div>
            <div>
              <p className="text-heading-sm font-display font-[400] text-champagne leading-[1]">20+</p>
              <p className="text-caption font-sans font-[400] text-cinema-white/40 uppercase tracking-[0.15em] mt-1">Brands</p>
            </div>
            <div>
              <p className="text-heading-sm font-display font-[400] text-champagne leading-[1]">Mumbai</p>
              <p className="text-caption font-sans font-[400] text-cinema-white/40 uppercase tracking-[0.15em] mt-1">India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ animation: "fadeIn 1s ease 2s forwards", opacity: 0 }}
      >
        <div className="scroll-indicator flex flex-col items-center gap-2">
          <span className="text-caption font-sans font-[400] text-cinema-white/30 uppercase tracking-[0.25em]">
            Scroll to Enter
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-cinema-white/30">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="8" cy="8" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}
