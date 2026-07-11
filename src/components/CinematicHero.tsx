"use client";

import { useEffect, useRef } from "react";

const MUTED_GOLD = "#C8A24D";
const OFF_WHITE = "#F5F5F2";

const stagger = [0, 0.1, 0.2, 0.3, 0.35, 0.4, 0.45];

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const onScroll = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.top > 0) return;
      const offset = rect.top * 0.08;
      bg.style.transform = `translateY(${Math.max(offset, -15)}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      {/* Background — dark, moody, no zoom */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transition: "transform 0.1s linear" }}
      >
        <img
          src="/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-[center_40%]"
          style={{
            filter: "brightness(0.72) contrast(1.12) saturate(0.95)",
          }}
          loading="eager"
        />
        {/* Dark gradient overlay — left heavy */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,8,8,.85) 0%, rgba(8,8,8,.55) 30%, rgba(8,8,8,.30) 60%, rgba(8,8,8,.08) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(8,8,8,.60) 0%, rgba(8,8,8,.06) 35%, transparent 65%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 md:px-12 pt-32 pb-20">
        <div className="max-w-2xl">
          {/* Role */}
          <p
            className="font-sans font-[400] uppercase mb-8"
            style={{
              fontSize: "11px",
              letterSpacing: "0.24em",
              color: "rgba(200,162,77,0.75)",
              opacity: 0,
              animation: "heroFade 0.9s cubic-bezier(0.25,0.1,0.25,1) 0.1s forwards",
              transform: "translateY(16px)",
            }}
          >
            Director&apos;s Assistant & Associate Producer
          </p>

          {/* Name */}
          <h1 className="text-balance" style={{ opacity: 0, animation: "heroFade 0.9s cubic-bezier(0.25,0.1,0.25,1) 0.2s forwards", transform: "translateY(16px)" }}>
            <span
              className="block font-display font-[400] leading-[0.9] tracking-[-0.04em]"
              style={{ fontSize: "clamp(52px, 10vw, 96px)", color: OFF_WHITE }}
            >
              DONAYAN
            </span>
            <span
              className="block font-display font-[400] leading-[0.9] tracking-[-0.04em] mt-1"
              style={{ fontSize: "clamp(52px, 10vw, 96px)", color: OFF_WHITE }}
            >
              SAHDEV
            </span>
          </h1>

          {/* Tagline */}
          <p
            className="mt-6 font-sans font-[300] leading-[1.6] max-w-lg"
            style={{
              fontSize: "clamp(14px, 1.4vw, 17px)",
              color: "rgba(245,245,242,0.6)",
              opacity: 0,
              animation: "heroFade 0.9s cubic-bezier(0.25,0.1,0.25,1) 0.35s forwards",
              transform: "translateY(16px)",
            }}
          >
            Commercial Advertising · Fashion · Celebrity Campaigns · Music Videos
          </p>

          {/* Description */}
          <p
            className="mt-4 font-sans font-[300] leading-[1.7] max-w-lg"
            style={{
              fontSize: "clamp(13px, 1.2vw, 15px)",
              color: "rgba(245,245,242,0.5)",
              opacity: 0,
              animation: "heroFade 0.9s cubic-bezier(0.25,0.1,0.25,1) 0.4s forwards",
              transform: "translateY(16px)",
            }}
          >
            Helping directors transform creative vision into flawlessly executed productions across India&apos;s biggest brands and agencies.
          </p>

          {/* CTA */}
          <div
            className="mt-10"
            style={{
              opacity: 0,
              animation: "heroFade 0.9s cubic-bezier(0.25,0.1,0.25,1) 0.5s forwards",
              transform: "translateY(16px)",
            }}
          >
            <a
              href="#wall"
              className="inline-flex items-center gap-3 font-sans font-[500] no-underline uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.2em",
                color: MUTED_GOLD,
                border: "1px solid rgba(200,162,77,0.35)",
                padding: "14px 32px",
                borderRadius: "4px",
                transition: "background 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(200,162,77,0.08)";
                e.currentTarget.style.borderColor = "rgba(200,162,77,0.6)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(200,162,77,0.35)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Explore Production Log
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: MUTED_GOLD }}>
                <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div
            className="flex gap-8 md:gap-12 mt-14"
            style={{
              opacity: 0,
              animation: "heroFade 0.9s cubic-bezier(0.25,0.1,0.25,1) 0.55s forwards",
              transform: "translateY(16px)",
            }}
          >
            <div>
              <p className="font-display font-[400] leading-[1]" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", color: MUTED_GOLD }}>60+</p>
              <p className="font-sans font-[400] uppercase mt-2" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(245,245,242,0.4)" }}>Commercial Productions</p>
            </div>
            <div>
              <p className="font-display font-[400] leading-[1]" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", color: MUTED_GOLD }}>28+</p>
              <p className="font-sans font-[400] uppercase mt-2" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(245,245,242,0.4)" }}>Brands</p>
            </div>
            <div>
              <p className="font-display font-[400] leading-[1]" style={{ fontSize: "clamp(20px, 2.5vw, 28px)", color: MUTED_GOLD }}>Mumbai</p>
              <p className="font-sans font-[400] uppercase mt-2" style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(245,245,242,0.4)" }}>India</p>
            </div>
          </div>
        </div>
      </div>

      {/* AVAILABLE FOR */}
      <div
        className="hidden md:block absolute bottom-12 right-12 z-10 text-right"
        style={{
          opacity: 0,
          animation: "heroFade 0.9s cubic-bezier(0.25,0.1,0.25,1) 0.65s forwards",
          transform: "translateY(12px)",
        }}
      >
        <p
          className="font-sans font-[500] uppercase mb-2"
          style={{
            fontSize: "10px",
            letterSpacing: "0.28em",
            color: "rgba(245,245,242,0.45)",
          }}
        >
          Available for
        </p>
        <div
          className="font-sans font-[500] uppercase leading-[1.8]"
          style={{
            fontSize: "14px",
            letterSpacing: "0.28em",
            color: "rgba(245,245,242,0.85)",
          }}
        >
          Brand Films<br />
          Music Videos<br />
          Commercials<br />
          Fashion
        </div>
      </div>

      {/* Scroll indicator — subtle */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{
          opacity: 0,
          animation: "heroFade 0.9s cubic-bezier(0.25,0.1,0.25,1) 0.75s forwards",
        }}
      >
        <span
          className="font-sans font-[400] uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.25em", color: "rgba(245,245,242,0.2)" }}
        >
          Scroll
        </span>
        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" style={{ color: "rgba(245,245,242,0.15)" }}>
          <rect x="1" y="1" width="10" height="16" rx="5" stroke="currentColor" strokeWidth="1" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
