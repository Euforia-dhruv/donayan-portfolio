"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const onScroll = () => {
      const rect = bg.getBoundingClientRect();
      if (rect.top > 0) return;
      const offset = rect.top * 0.05;
      bg.style.transform = `translateY(${Math.max(offset, -10)}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-cinema-black overflow-hidden">
      {/* Background image with parallax + overlays */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transition: "transform 0.05s linear" }}
      >
        <img
          src="/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-[center_40%]"
          style={{
            filter: "brightness(0.78) contrast(1.3) saturate(1.05)",
          }}
          loading="lazy"
        />
        {/* Cinematic overlay: darker left → lighter right + vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 30%, rgba(0,0,0,.12) 60%, rgba(0,0,0,.04) 100%), radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.25) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-10 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-center gap-16 md:gap-20">
          {/* Left text */}
          <div className="flex-1 max-w-2xl">
            {/* Label */}
            <p
              className="font-switzer font-[400] uppercase tracking-[0.12em]"
              style={{
                fontSize: "11px",
                color: "rgba(200,162,77,0.8)",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.08s forwards",
                transform: "translateY(16px)",
              }}
            >
              Director&apos;s Assistant & Associate Producer
            </p>

            {/* Name */}
            <h1
              className="font-switzer font-[500] leading-[0.95] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(56px, 7vw, 100px)",
                color: "#F5F5F2",
                marginTop: "36px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.16s forwards",
                transform: "translateY(16px)",
              }}
            >
              Donayan
              <br />
              Sahdev
            </h1>

            {/* Subtitle */}
            <p
              className="font-switzer font-[300] leading-[1.5] max-w-lg"
              style={{
                fontSize: "clamp(15px, 1.15vw, 18px)",
                color: "rgba(245,245,242,0.65)",
                marginTop: "32px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.24s forwards",
                transform: "translateY(16px)",
              }}
            >
              Commercial Advertising · Fashion · Celebrity Campaigns · Music Videos
            </p>

            {/* Description */}
            <p
              className="font-switzer font-[300] leading-[1.7] max-w-[480px]"
              style={{
                fontSize: "clamp(13px, 0.95vw, 15px)",
                color: "rgba(245,245,242,0.5)",
                marginTop: "20px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.32s forwards",
                transform: "translateY(16px)",
              }}
            >
              Helping directors transform creative vision into flawlessly executed productions across India&apos;s biggest brands and agencies.
            </p>

            {/* CTA — gold button */}
            <div
              style={{
                marginTop: "44px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.4s forwards",
                transform: "translateY(16px)",
              }}
            >
              <a
                href="#wall"
                className="inline-flex items-center gap-3 font-switzer font-[400] no-underline"
                style={{
                  fontSize: "12px",
                  height: "52px",
                  padding: "0 32px",
                  borderRadius: "8px",
                  background: "#C8A24D",
                  color: "#0A0A0A",
                  letterSpacing: "0.04em",
                  transition: "transform 0.25s ease, filter 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              >
                Explore Production Log
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#0A0A0A]">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Stats */}
            <div
              className="flex gap-10 md:gap-14"
              style={{
                marginTop: "56px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.48s forwards",
                transform: "translateY(16px)",
              }}
            >
              <div>
                <p className="font-switzer font-[500] leading-[1]" style={{ fontSize: "clamp(22px, 2vw, 28px)", color: "#C8A24D" }}>60+</p>
                <p className="font-switzer font-[400] mt-2" style={{ fontSize: "11px", letterSpacing: "0.04em", color: "rgba(245,245,242,0.5)" }}>Commercial Productions</p>
              </div>
              <div>
                <p className="font-switzer font-[500] leading-[1]" style={{ fontSize: "clamp(22px, 2vw, 28px)", color: "#C8A24D" }}>28+</p>
                <p className="font-switzer font-[400] mt-2" style={{ fontSize: "11px", letterSpacing: "0.04em", color: "rgba(245,245,242,0.5)" }}>Brands</p>
              </div>
              <div>
                <p className="font-switzer font-[500] leading-[1]" style={{ fontSize: "clamp(22px, 2vw, 28px)", color: "#C8A24D" }}>Mumbai</p>
                <p className="font-switzer font-[400] mt-2" style={{ fontSize: "11px", letterSpacing: "0.04em", color: "rgba(245,245,242,0.5)" }}>India</p>
              </div>
            </div>
          </div>

          {/* Right — empty (image is behind) */}
          <div className="flex-1" />
        </div>
      </div>

      {/* Scroll */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          opacity: 0,
          animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.6s forwards",
        }}
      >
        <span className="font-switzer font-[400] uppercase" style={{ fontSize: "9px", letterSpacing: "0.1em", color: "rgba(245,245,242,0.3)" }}>Scroll</span>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{ color: "rgba(245,245,242,0.2)" }}>
          <rect x="1" y="1" width="8" height="14" rx="4" stroke="currentColor" strokeWidth="1" />
          <circle cx="5" cy="5.5" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
