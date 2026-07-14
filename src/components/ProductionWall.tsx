"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import wallAssets from "@/lib/wall-assets.json";
import videoDescRaw from "@/lib/video-desc.json";
import AutoVideo from "@/components/AutoVideo";
import Lightbox, { type LightboxData } from "@/components/Lightbox";

const videoDesc = videoDescRaw as Record<string, string>;

interface WallAsset {
  file: string;
  kind: string;
  aspect: string;
  source: string;
  platform: string;
  label: string;
  title?: string;
  category?: string;
  year?: string;
  description?: string;
}

export default function ProductionWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxData | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.04 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const descOf = (a: WallAsset) => videoDesc[a.file] || a.description || "";

  const open = (a: WallAsset) => {
    setLightbox({
      type: a.kind === "video" ? "video" : "image",
      src: a.file,
      source: a.source,
      title: a.title || a.label,
      platform: a.platform,
      description: descOf(a),
      category: a.category,
      year: a.year,
    });
  };

  return (
    <section
      id="wall"
      ref={sectionRef}
      className="relative w-full bg-cinema-black"
      style={{ padding: "clamp(40px, 6vw, 80px) 0" }}
      aria-label="Production Wall"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.03,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 text-center md:mb-14">
          <p className="font-switzer text-caption font-[400] uppercase tracking-[0.12em] text-stone">
            The Moodboard
          </p>
          <h2
            className="mt-3 font-switzer font-[300] leading-[1] tracking-[-0.03em]"
            style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}
          >
            The Wall
          </h2>
          <p className="mt-2 font-switzer text-caption font-[400] text-stone/60">
            {wallAssets.length} selected works · click to view the original
          </p>
        </div>

        <div
          className="columns-2 gap-6 [column-fill:_balance] sm:columns-3 lg:columns-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {wallAssets.map((a: WallAsset, i: number) => (
            <div
              key={a.file}
              role="button"
              tabIndex={0}
              onClick={() => open(a)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(a); } }}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-charcoal text-left outline-none ring-gold/0 transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)] focus-visible:ring-2 focus-visible:ring-gold"
              style={{
                aspectRatio: a.aspect,
                animation: visible
                  ? `cardEntrance 0.6s ease ${0.02 + i * 0.03}s forwards`
                  : "none",
                opacity: 0,
              }}
                aria-label={`${a.title || a.label} — open original`}
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                {a.kind === "video" ? (
                  <AutoVideo src={a.file} mode="autoplay" />
                ) : (
                  <Image
                    src={a.file}
                    alt={a.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
                    className="object-cover"
                    priority={i < 6}
                  />
                )}
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="font-switzer text-[10px] font-[400] uppercase tracking-[0.1em] text-gold/75">
                  {a.category || a.platform}
                  {a.year ? ` · ${a.year}` : ""}
                </p>
                <p className="mt-0.5 font-switzer text-caption font-[400] leading-tight text-cinema-white">
                  {a.title || a.label}
                </p>
                {descOf(a) && (
                  <p className="mt-1 line-clamp-3 font-switzer text-[11px] font-[300] leading-snug text-cinema-white/70">
                    {descOf(a)}
                  </p>
                )}
                <span className="mt-1 inline-block text-[10px] font-switzer uppercase tracking-[0.1em] text-gold/80">
                  View Original
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox data={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
