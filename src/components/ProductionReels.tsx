"use client";

import { useEffect, useRef, useState } from "react";
import { useProjects } from "@/lib/convex/site-data";
import { getYouTubeThumbnail } from "@/lib/video-utils";

function ReelCard({ item, span }: { item: any; span: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const url = item.externalUrl || "";
  const thumb = item.thumbnail || getYouTubeThumbnail(url) || "";
  const isVideo = (item.videos && item.videos.length > 0) || url.includes("youtube") || url.includes("instagram");

  const aspectRatio = item.orientation === "portrait" ? "9 / 16" : item.orientation === "square" ? "1 / 1" : "4 / 3";

  if (!thumb && !isVideo) return null;

  const label = item.brand || item.title || "Campaign";

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        borderRadius: "24px",
        backgroundColor: "#141414",
        aspectRatio,
        transform: hovered ? "scale(1.015)" : "scale(1)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.3)",
        filter: hovered ? "brightness(1.05)" : "brightness(1)",
        transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.6s ease, filter 0.6s ease",
        gridColumn: `span ${span}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (url) window.open(url, "_blank", "noopener,noreferrer"); }}
    >
      {thumb && !imgError ? (
        <img src={thumb} alt={label} className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1a1a1a,#0d0d0d)" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white" opacity="0.4" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        </div>
      )}

      {isVideo && thumb && !imgError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: hovered ? 0 : 0.85, transition: "opacity 0.4s ease" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(20,20,20,0.75)", border: "1px solid rgba(255,255,255,0.25)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#F5F5F2", marginLeft: "2px" }}><path d="M8 5v14l11-7L8 5z" /></svg>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          borderRadius: "24px",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0) 60%)",
          opacity: hovered ? 1 : 0.7,
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ padding: "0 24px 28px", transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "transform 350ms ease, opacity 350ms ease" }}
      >
        {item.title && (
          <p className="font-switzer text-white font-semibold" style={{ fontSize: "18px", lineHeight: 1.25, marginBottom: "6px" }}>{item.title}</p>
        )}
        {(item.role || item.year) && (
          <p className="font-switzer text-white/60" style={{ fontSize: "13px", lineHeight: 1.4, marginBottom: item.description ? "8px" : "0" }}>
            {item.role}{item.role && item.year ? " · " : ""}{item.year}
          </p>
        )}
        {item.description && (
          <p className="font-switzer text-white/80" style={{ fontSize: "14px", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
        )}
      </div>
    </div>
  );
}

export default function ProductionReels() {
  const [show, setShow] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { projects } = useProjects();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShow(true); obs.unobserve(el); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const reels = (projects || []).filter((p: any) =>
    (p.videos && p.videos.length > 0) || (p.externalUrl && (p.externalUrl.includes("youtube") || p.externalUrl.includes("instagram")))
  );

  return (
    <section
      id="production-reels"
      ref={sectionRef}
      style={{ backgroundColor: "#0A0A0A", paddingTop: "80px", paddingBottom: "80px" }}
    >
      <div style={{ maxWidth: "1500px", margin: "0 auto", paddingLeft: "clamp(32px, 5vw, 40px)", paddingRight: "clamp(32px, 5vw, 40px)" }}>
        <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
          <p className="text-xs font-switzer font-[400] uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(200,162,77,0.6)" }}>Production Archive</p>
          <h2 className="font-switzer font-[300] leading-[1] tracking-[-0.03em] mb-8" style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}>Production Reels</h2>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gridAutoFlow: "dense" }}>
          {reels.map((item: any, i: number) => {
            const span = item.orientation === "portrait" ? 1 : 2;
            return (
              <div
                key={item._id}
                style={{
                  gridColumn: `span ${span}`,
                  opacity: 0,
                  animation: show ? `cardEntrance 0.7s ease-out ${0.05 + i * 0.045}s forwards` : "none",
                }}
              >
                <ReelCard item={item} span={span} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
