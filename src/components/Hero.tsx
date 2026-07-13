"use client";

import { useEffect, useRef } from "react";
import { getMediaUrl } from "@/lib/media";

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
          src={getMediaUrl("/hero-bg.jpg")}
          alt=""
          className="w-full h-full object-cover object-[center_40%]"
          style={{
            filter: "brightness(0.78) contrast(1.3) saturate(1.05)",
          }}
          loading="lazy"
        />
        {/* Stronger left gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,.72) 0%, rgba(0,0,0,.45) 35%, rgba(0,0,0,.12) 65%, transparent 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-10 pt-20 pb-16">
        <div className="flex flex-col md:flex-row md:items-center gap-16 md:gap-20">
          {/* Left text */}
          <div className="flex-1" style={{ maxWidth: "500px" }}>
            {/* Eyebrow */}
            <p
              className="font-switzer font-[400] uppercase tracking-[0.12em]"
              style={{
                fontSize: "10px",
                color: "rgba(200,162,77,0.6)",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.08s forwards",
                transform: "translateY(16px)",
              }}
            >
              Director&apos;s Assistant · Associate Producer
            </p>

            {/* Name */}
            <h1
              className="font-switzer font-[500] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(60px, 8vw, 110px)",
                lineHeight: "0.92",
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
              className="font-switzer font-[300] leading-[1.5]"
              style={{
                fontSize: "clamp(15px, 1.15vw, 18px)",
                color: "rgba(245,245,242,0.88)",
                marginTop: "56px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.24s forwards",
                transform: "translateY(16px)",
              }}
            >
              Commercial Advertising · Fashion · Celebrity Campaigns · Music Videos
            </p>

            {/* Description */}
            <p
              className="font-switzer font-[300] leading-[1.7]"
              style={{
                fontSize: "clamp(15px, 1vw, 16px)",
                color: "rgba(245,245,242,0.5)",
                marginTop: "28px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.32s forwards",
                transform: "translateY(16px)",
              }}
            >
              Helping directors bring creative ideas to life through
              seamless production, coordination, and execution for
              India&apos;s leading brands, agencies, and artists.
            </p>

            {/* CTA — gold button */}
            <div
              style={{
                marginTop: "74px",
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
              className="flex gap-12 md:gap-16"
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

        </div>
      </div>

      {/* Available For */}
      <div
        className="absolute z-10"
        style={{
          bottom: "70px",
          right: "clamp(32px, 5vw, 40px)",
          opacity: 0,
          animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.56s forwards",
          transform: "translateY(16px)",
        }}
      >
        <p
          className="font-switzer font-[400] uppercase tracking-[0.12em]"
          style={{ fontSize: "10px", color: "rgba(245,245,242,0.4)" }}
        >
          Available For
        </p>
        <p
          className="font-switzer font-[500]"
          style={{ fontSize: "clamp(18px, 1.4vw, 20px)", lineHeight: "1.4", color: "rgba(245,245,242,0.85)", marginTop: "8px" }}
        >
          Brand Films<br />
          Commercials<br />
          Music Videos<br />
          Fashion
        </p>
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
