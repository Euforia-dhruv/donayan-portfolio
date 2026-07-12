"use client";

import { useEffect, useRef, useState } from "react";
import { getYouTubeThumbnail, getYouTubeId } from "@/lib/video-utils";
import archiveData from "@/data/archive.json";

interface VideoEntry {
  id: number;
  url: string;
  title: string;
  brand: string;
  year: string;
  role: string;
}

interface ArchiveItem {
  url: string;
  title: string;
  brand: string;
  year: string;
  role: string;
}

const TXT_RAW = `1https://www.youtube.com/watch?v=1wqdb9s3kfo
2https://www.youtube.com/watch?v=zlQc2GHojL8
3https://www.youtube.com/watch?v=E924AYIaCRw
4https://www.instagram.com/reel/DPVoyKujVe4/
5https://youtu.be/F9m4xEH2-dU
6https://www.instagram.com/p/Cz-2Mi0C6Bg/
9https://www.instagram.com/pocketfm.stories/reel/C24lSvovffw/
10https://www.instagram.com/p/C7bjXlbtp4Z/
11https://www.instagram.com/p/C-MkhP6ykXP/
12https://www.instagram.com/p/C4h8FkuN7Li/
13https://www.instagram.com/p/C7RB6gGoVDQ/
14https://www.instagram.com/p/C6BbgzXoyLR/
15https://www.instagram.com/p/C2Zu8u2p7di/
16https://www.instagram.com/p/C9Hady1yVDJ/
17https://www.instagram.com/reel/C22aMEvoiJl/?utm_source=ig_web_copy_link
18https://www.instagram.com/reel/Cr0W-g_NBpu/?utm_source=ig_web_copy_link
19https://youtube.com/shorts/kVqN7LIbLUM?si=oTajKf2mpI3djwMy
22https://www.instagram.com/p/C2uMuHjJmk_/
23https://www.youtube.com/watch?app=desktop&v=or5XQteDzYU
24https://www.instagram.com/p/CmoS25uhkQG/
25https://www.instagram.com/p/ClgcOJiDf2n/
26https://www.youtube.com/watch?v=W2KMt80-Kg0
27https://www.youtube.com/watch?feature=shared&fbclid=PAZXh0bgNhZW0CMTEAAadpVEpFYvty656IN9z_noVfym2_c5Bs8TR4Og10GSvEkgiJ0uM1E29xRg22Cw_aem_8GNvfG_hk81mjmB0XyyD0A&v=OjwGqh_jB6Y
28https://www.youtube.com/watch?v=RKjF5jTDbC8&t=1s`;

function isYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function getInstagramCode(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:[a-zA-Z0-9_.-]+\/)?(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function extractVideoId(url: string): string | null {
  const yt = getYouTubeId(url);
  if (yt) return yt;
  return getInstagramCode(url);
}

function parseEntries(): VideoEntry[] {
  const archiveLookup = new Map<string, ArchiveItem>();
  for (const item of archiveData as ArchiveItem[]) {
    const id = extractVideoId(item.url);
    if (id) archiveLookup.set(id, item);
  }

  const entries: VideoEntry[] = [];
  for (const line of TXT_RAW.trim().split("\n")) {
    const m = line.match(/^(\d+)/);
    if (!m) continue;
    const id = parseInt(m[0], 10);
    const url = line.slice(m[0].length).trim();
    if (!url) continue;
    const vidId = extractVideoId(url);
    const arch = vidId ? archiveLookup.get(vidId) : undefined;
    entries.push({
      id,
      url,
      title: arch?.title || `Video ${id}`,
      brand: arch?.brand || "",
      year: arch?.year || "",
      role: arch?.role || "",
    });
  }
  return entries;
}

const ENTRIES = parseEntries();

const SPANS = [
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 1 }, { col: 2 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
];

function ReelCard({ entry }: { entry: VideoEntry }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hasMp4, setHasMp4] = useState(true);
  const [poster, setPoster] = useState<string | undefined>();

  useEffect(() => {
    const img = new Image();
    const jpgUrl = `/assets/videos/${entry.id}.jpg`;
    img.onload = () => setPoster(jpgUrl);
    img.onerror = () => {
      if (isYoutubeUrl(entry.url)) {
        setPoster(getYouTubeThumbnail(entry.url) ?? undefined);
      }
    };
    img.src = jpgUrl;

    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", `/assets/videos/${entry.id}.mp4`, true);
    xhr.onload = () => setHasMp4(xhr.status === 200);
    xhr.onerror = () => setHasMp4(false);
    xhr.send();
  }, [entry.id, entry.url]);

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

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: "12px",
        backgroundColor: "#141414",
        aspectRatio: "16 / 9",
        transition: "transform 0.5s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.5s ease, filter 0.5s ease",
        transform: hovered ? "scale(1.02)" : "scale(1)",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.3)",
        filter: hovered ? "brightness(1.08)" : "brightness(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasMp4 ? (
        <video
          ref={videoRef}
          src={`/assets/videos/${entry.id}.mp4`}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={poster || ""}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            const t = e.currentTarget;
            if (t.dataset.fb) return;
            t.dataset.fb = "1";
            t.style.display = "none";
            const fb = t.parentElement?.querySelector<HTMLElement>(".rf-fb");
            if (fb) fb.style.display = "flex";
          }}
        />
      )}

      <div className="rf-fb absolute inset-0 items-center justify-center" style={{ display: "none", backgroundColor: "#1E1E1E", borderRadius: "12px" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(245,245,242,0.2)" }}>
          <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2 17l5-5 3 3 4-4 6 6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "12px",
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Metadata */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none px-4 pb-4"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {entry.brand && (
          <p className="text-xs font-switzer font-[500] uppercase tracking-[0.04em]" style={{ color: "rgba(245,245,242,0.75)" }}>
            {entry.brand}
          </p>
        )}
        {(entry.role || entry.year) && (
          <p className="text-xs font-switzer font-[400]" style={{ color: "rgba(245,245,242,0.45)" }}>
            {entry.role}{entry.role && entry.year ? " · " : ""}{entry.year}
          </p>
        )}
      </div>

      {/* Play button */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: hovered ? 1 : 0.7, transition: "opacity 0.5s ease" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: hovered ? "rgba(200,162,77,0.9)" : "rgba(20,20,20,0.8)",
            transform: hovered ? "scale(1)" : "scale(0.85)",
            transition: "all 0.5s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: hovered ? "#0A0A0A" : "#F5F5F2", marginLeft: "2px" }}>
            <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ProductionReels() {
  const [show, setShow] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
        {/* Header */}
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

        {/* Grid */}
        <div className="grid gap-5 md:gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {ENTRIES.map((entry, i) => {
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
                onClick={() => window.open(entry.url, "_blank")}
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
