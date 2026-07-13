"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useProjects } from "@/lib/convex/site-data";
import { Media, isPlayableSource, type MediaSource } from "@/components/Media";
import wallAssets from "@/lib/wall-assets.json";

interface WallItem {
  key: string;
  file: string;
  source: MediaSource;
  externalUrl: string;
  orientation: string;
  playable: boolean;
  label: string;
}

function aspectFor(orientation?: string): string {
  if (orientation === "portrait") return "9 / 16";
  if (orientation === "square") return "1 / 1";
  return "4 / 3";
}

function WallCard({ item }: { item: WallItem }) {
  const [hovered, setHovered] = useState(false);
  const open = () => {
    if (item.externalUrl) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mb-5 break-inside-avoid">
      <div
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-charcoal outline-none transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-gold"
        style={{
          aspectRatio: aspectFor(item.orientation),
          boxShadow: hovered
            ? "0 24px 60px rgba(0,0,0,0.55)"
            : "0 4px 14px rgba(0,0,0,0.25)",
        }}
        aria-label={`${item.label} — open original`}
      >
        <Media source={item.source} label={item.label} alt={item.label} showPlay={item.playable} rounded />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 p-4 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-2 ${item.playable ? "translate-y-0 opacity-100" : "opacity-0"}`}
        >
          <p className="font-switzer text-body-sm font-[400] leading-tight text-cinema-white">
            {item.label}
          </p>
          <span className="mt-1 inline-block text-caption font-switzer uppercase tracking-[0.02em] text-gold/80">
            Open Original
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductionWall() {
  const { projects } = useProjects();
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const items: WallItem[] = useMemo(() => {
    return wallAssets.map((asset, i) => {
      const p = projects[asset.projectIndex];
      const sourceUrl = p?.externalUrl || p?.videos?.[0] || asset.file;
      const label = p?.brand || p?.title || `Work ${i + 1}`;
      const isVideo = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(asset.file);
      const source: MediaSource = { src: asset.file };
      const playable = isVideo || isPlayableSource(source);
      return {
        key: asset.file,
        file: asset.file,
        source,
        externalUrl: sourceUrl,
        orientation: p?.orientation || (isVideo ? "landscape" : "square"),
        playable,
        label,
      };
    });
  }, [projects]);

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
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section
      id="wall"
      ref={sectionRef}
      className="relative w-full bg-cinema-black"
      style={{ padding: "clamp(40px, 6vw, 80px) 0" }}
      aria-label="Production Archive Wall"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.035,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-8 md:px-10">
        <div className="mb-12 text-center md:mb-16">
          <p className="font-switzer text-caption font-[400] uppercase tracking-[0.02em] text-stone">
            Production Archive
          </p>
          <h2
            className="mt-3 font-switzer font-[300] leading-[1] tracking-[-0.03em]"
            style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}
          >
            The Wall
          </h2>
          <p className="mt-2 font-switzer text-caption font-[400] text-stone/60">
            {items.length} works
          </p>
        </div>

        <div
          className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {items.map((item) => (
            <WallCard key={item.key} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
