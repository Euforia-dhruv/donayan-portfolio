"use client";

import { useEffect, useRef, useState } from "react";
import type { ArchiveEntry } from "@/lib/types";

const SPANS = [
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 1 }, { col: 2 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
];

function ReelCard({ entry }: { entry: ArchiveEntry }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hasVideo, setHasVideo] = useState(!!entry.video);

  useEffect(() => {
    if (!entry.video) return;
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", `/assets/videos/${entry.video}`, true);
    xhr.onload = () => setHasVideo(xhr.status === 200);
    xhr.onerror = () => setHasVideo(false);
    xhr.send();
  }, [entry.video]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (e.isIntersecting) vid.play().catch(() => {});
        else vid.pause();
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const getImgSrc = (name: string) => `/assets/videos/${name}`;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: "12px",
        backgroundColor: "#141414",
        transition: "transform 0.5s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.5s ease",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (entry.url) window.open(entry.url, "_blank"); }}
    >
      {/* Production number */}
      <div
        className="absolute top-3 left-3 z-10 pointer-events-none"
        style={{ color: "rgba(245,245,242,0.25)", fontSize: "11px", fontFamily: "var(--font-switzer, Inter, sans-serif)", fontWeight: 400, letterSpacing: "0.04em" }}
      >
        #{entry.id}
      </div>

      {/* Video */}
      {hasVideo && entry.video ? (
        <video
          ref={videoRef}
          src={`/assets/videos/${entry.video}`}
          muted
          loop
          playsInline
          preload="none"
          className="w-full object-cover"
          style={{ display: "block", aspectRatio: "16 / 9", borderRadius: "12px 12px 0 0" }}
        />
      ) : null}

      {/* Image collage for image-only or below-video */}
      {entry.images.length > 0 ? (
        entry.images.length === 1 ? (
          <img
            src={getImgSrc(entry.images[0])}
            alt=""
            className="w-full object-cover"
            style={{ display: "block", aspectRatio: "16 / 9", borderRadius: hasVideo ? "0" : "12px" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : entry.images.length >= 4 ? (
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr 1fr",
              aspectRatio: "16 / 9",
              gap: "3px",
              borderRadius: hasVideo ? "0" : "12px",
              overflow: "hidden",
            }}
          >
            <img src={getImgSrc(entry.images[0])} alt="" className="w-full h-full object-cover" style={{ gridColumn: "1 / 3", gridRow: "1 / 3" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <img src={getImgSrc(entry.images[1])} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <img src={getImgSrc(entry.images[2])} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            <img src={getImgSrc(entry.images[3])} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            {entry.images[4] && <img src={getImgSrc(entry.images[4])} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
          </div>
        ) : (
          <div className="flex w-full" style={{ aspectRatio: "16 / 9", gap: "3px", borderRadius: hasVideo ? "0" : "12px", overflow: "hidden" }}>
            {entry.images.map((img, j) => (
              <img key={j} src={getImgSrc(img)} alt="" className="flex-1 h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            ))}
          </div>
        )
      ) : !hasVideo ? (
        <div style={{ aspectRatio: "16 / 9", backgroundColor: "#1E1E1E", borderRadius: "12px" }} />
      ) : null}

      {/* Fallback for no video + no images */}
      {!hasVideo && entry.images.length === 0 && (
        <div style={{ aspectRatio: "16 / 9", backgroundColor: "#1E1E1E", borderRadius: "12px" }} />
      )}

      {/* Hover overlay */}
      <div
        className="pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "12px",
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Metadata bottom */}
      <div
        className="pointer-events-none px-4 pb-4"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {entry.brand && (
          <p className="text-xs font-switzer font-[500] uppercase tracking-[0.04em]" style={{ color: "rgba(245,245,242,0.8)" }}>
            {entry.brand}
          </p>
        )}
        <p className="text-xs font-switzer font-[400]" style={{ color: "rgba(245,245,242,0.5)" }}>
          {entry.role}{entry.role && entry.year ? " · " : ""}{entry.year}
        </p>
      </div>

      {/* Play icon overlay (only when video) */}
      {hasVideo && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: hovered ? 1 : 0.6, transition: "opacity 0.4s ease" }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: hovered ? "rgba(200,162,77,0.9)" : "rgba(20,20,20,0.7)",
              transform: hovered ? "scale(1)" : "scale(0.85)",
              transition: "all 0.4s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: hovered ? "#0A0A0A" : "#F5F5F2", marginLeft: "2px" }}>
              <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductionReels() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [show, setShow] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/assets/archive/archive.json")
      .then((r) => r.json())
      .then((data) => setEntries(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShow(true); },
      { threshold: 0.05 }
    );
    const el = sectionRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="production-reels"
      ref={sectionRef}
      style={{
        backgroundColor: "#0A0A0A",
        paddingTop: "180px",
        paddingBottom: "120px",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
          paddingLeft: "clamp(32px, 5vw, 40px)",
          paddingRight: "clamp(32px, 5vw, 40px)",
        }}
      >
        <div
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <p
            className="text-xs font-switzer font-[400] uppercase tracking-[0.12em] mb-3"
            style={{ color: "rgba(200,162,77,0.6)" }}
          >
            Production Archive
          </p>
          <h2
            className="font-switzer font-[300] leading-[1] tracking-[-0.03em] mb-12 md:mb-16"
            style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}
          >
            Production Reels
          </h2>
        </div>

        <div className="grid gap-5 md:gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {entries.map((entry, i) => {
            const span = SPANS[i % SPANS.length];
            return (
              <div
                key={entry.id}
                style={{
                  gridColumn: `span ${span.col}`,
                  opacity: 0,
                  animation: show
                    ? `cardEntrance 0.7s ease-out ${0.05 + i * 0.06}s forwards`
                    : "none",
                }}
              >
                <ReelCard entry={entry} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
