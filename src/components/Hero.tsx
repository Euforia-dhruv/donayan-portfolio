"use client";

import { useEffect, useRef } from "react";
import { getMediaUrl } from "@/lib/media";

const STATS = [
  { value: "60+", label: "Commercial Productions" },
  { value: "28+", label: "Brands" },
  { value: "5+", label: "Years in Production" },
  { value: "Mumbai", label: "India" },
];

const AVAILABLE_FOR = ["Brand Films", "Commercials", "Music Videos", "Fashion"];

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

  const openPopup = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("work-with-me"));
    }
  };

  return (
    <>
      <link rel="preload" as="image" href={getMediaUrl("/hero-bg.jpg")} fetchPriority="high" />
      <section
        className="relative flex min-h-[100svh] items-center overflow-hidden bg-cinema-black"
        aria-label="Hero"
      >
        <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ transition: "transform 0.05s linear" }}>
          <img
            src={getMediaUrl("/hero-bg.jpg")}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{ filter: "brightness(0.78) contrast(1.3) saturate(1.05)" }}
          />
          <video
            src={getMediaUrl("/assets/archive/4.mp4")}
            poster={getMediaUrl("/hero-bg.jpg")}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{ filter: "brightness(0.78) contrast(1.3) saturate(1.05)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.5) 38%, rgba(0,0,0,.18) 70%, rgba(0,0,0,.05) 100%)",
            }}
          />
        </div>

        <div
          className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 pt-[calc(env(safe-area-inset-top)_+_6rem)] md:px-10 md:pb-20"
        >
          <div className="max-w-[680px]">
            <p
              className="font-switzer font-[400] uppercase tracking-[0.12em]"
              style={{
                fontSize: "10px",
                color: "rgba(200,162,77,0.7)",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.08s forwards",
                transform: "translateY(16px)",
              }}
            >
              Freelance
            </p>

            <h1
              className="font-switzer font-[500] tracking-[-0.03em]"
              style={{
                fontSize: "clamp(44px, 11vw, 110px)",
                lineHeight: "0.95",
                color: "#F5F5F2",
                marginTop: "20px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.16s forwards",
                transform: "translateY(16px)",
              }}
            >
              Donayan
              <br />
              Sahdev
            </h1>

            <p
              className="line-clamp-2 font-switzer font-[300] leading-[1.25]"
              style={{
                fontSize: "clamp(18px, 1.6vw, 26px)",
                color: "rgba(245,245,242,0.92)",
                marginTop: "18px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.22s forwards",
                transform: "translateY(16px)",
              }}
            >
              Freelance Director&apos;s Assistant
              <br />
              Creative Producer
            </p>

            <p
              className="line-clamp-4 font-switzer font-[300] leading-[1.6]"
              style={{
                fontSize: "clamp(14px, 1vw, 16px)",
                color: "rgba(245,245,242,0.55)",
                marginTop: "16px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.28s forwards",
                transform: "translateY(16px)",
              }}
            >
              Helping directors bring creative ideas to life through seamless production, coordination, and
              execution for India&apos;s leading brands, agencies, and artists.
            </p>

            <div
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{
                marginTop: "28px",
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.36s forwards",
                transform: "translateY(16px)",
              }}
            >
              <a
                href="#wall"
                className="inline-flex w-full items-center justify-center gap-3 rounded-lg font-switzer text-body-sm font-[400] no-underline transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black sm:w-auto"
                style={{ height: "52px", padding: "0 32px", background: "#C8A24D", color: "#0A0A0A", letterSpacing: "0.04em" }}
              >
                Explore Production Log
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#0A0A0A]" aria-hidden="true">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button
                type="button"
                onClick={openPopup}
                className="inline-flex w-full items-center justify-center rounded-lg border border-gold/40 font-switzer text-body-sm font-[400] no-underline text-gold transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black sm:w-auto"
                style={{ height: "52px", padding: "0 28px", letterSpacing: "0.04em" }}
              >
                Work With Me
              </button>
            </div>

            <div
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6"
              style={{
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.44s forwards",
                transform: "translateY(16px)",
              }}
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-switzer font-[500] leading-[1]" style={{ fontSize: "clamp(22px, 2vw, 30px)", color: "#C8A24D" }}>
                    {s.value}
                  </p>
                  <p className="mt-1.5 font-switzer font-[400]" style={{ fontSize: "11px", letterSpacing: "0.04em", color: "rgba(245,245,242,0.5)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-8"
              style={{
                opacity: 0,
                animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.5s forwards",
                transform: "translateY(16px)",
              }}
            >
              <p className="font-switzer font-[400] uppercase tracking-[0.12em]" style={{ fontSize: "10px", color: "rgba(245,245,242,0.4)" }}>
                Available For
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {AVAILABLE_FOR.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-gold/30 px-3.5 py-1.5 font-switzer font-[400] text-cinema-white/80"
                    style={{ fontSize: "12px", letterSpacing: "0.02em" }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom)_+_1.5rem)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ opacity: 0, animation: "heroFade 0.8s cubic-bezier(0.25,0.1,0.25,1) 0.6s forwards" }}
          aria-hidden="true"
        >
          <span className="font-switzer font-[400] uppercase" style={{ fontSize: "9px", letterSpacing: "0.1em", color: "rgba(245,245,242,0.3)" }}>
            Scroll
          </span>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none" style={{ color: "rgba(245,245,242,0.25)" }} aria-hidden="true">
            <rect x="1" y="1" width="8" height="14" rx="4" stroke="currentColor" strokeWidth="1" />
            <circle cx="5" cy="5.5" r="1.5" fill="currentColor" />
          </svg>
        </div>
      </section>
    </>
  );
}
