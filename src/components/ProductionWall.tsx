"use client";

import { useEffect, useRef, useState } from "react";
import { getYouTubeThumbnail, getYouTubeId } from "@/lib/video-utils";
import archiveData from "@/data/archive.json";

// ── Photo cards (existing) ──────────────────────────
interface PhotoCard {
  type: "photo";
  id: string;
  src: string;
  title: string;
  pdf: string | null;
}

const PHOTO_CARDS: PhotoCard[] = [
  { type: "photo", id: "p-centrum",  src: "/PPM Decks/Centrum.png",              title: "Centrum",        pdf: null },
  { type: "photo", id: "p-hdfc",     src: "/PPM Decks/HDFC.png",                 title: "HDFC KVS",       pdf: "/PPM Decks/HDFC KVS Post PPM Deck.pdf" },
  { type: "photo", id: "p-murgi-2",  src: "/Movie - OTT pitches/Murgi 1.png",    title: "Murgi",          pdf: "/Movie - OTT pitches/Murgi.pdf" },
  { type: "photo", id: "p-ponds",    src: "/Treatment Notes/ponds.png",          title: "Ponds BB Cream", pdf: "/Treatment Notes/Ponds  BB cream TN.pdf" },
  { type: "photo", id: "p-justbe",   src: "/Marketing Pitch/Just be.png",        title: "Just Be",        pdf: "/Marketing Pitch/Just Be.pdf" },
  { type: "photo", id: "p-tanishq",  src: "/Others/Tanishq.png",                 title: "Tanishq",        pdf: "/Others/Tanishq Casting.pdf" },
  { type: "photo", id: "p-sprite",   src: "/PPM Decks/Sprite.png",               title: "Sprite",         pdf: null },
  { type: "photo", id: "p-idee",     src: "/PPM Decks/IDEE.png",                 title: "IDEE",           pdf: "/PPM Decks/IDEE PPM.pdf" },
  { type: "photo", id: "p-godrej",   src: "/Treatment Notes/godrej.png",          title: "Godrej Capital", pdf: "/Treatment Notes/Godrej Capital - Director_s Note.pdf" },
  { type: "photo", id: "p-oool",     src: "/Marketing Pitch/oool.png",           title: "OOOL Digital",   pdf: "/Marketing Pitch/OOOL Digital Strategy.pdf" },
  { type: "photo", id: "p-ax",       src: "/PPM Decks/AX.png",                   title: "AX",             pdf: "/PPM Decks/AX Celebrity Shoot SS_25.pdf" },
  { type: "photo", id: "p-artkalaa", src: "/Marketing Pitch/artkalaa.png",       title: "Artkalaa",       pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf" },
  { type: "photo", id: "p-kinder",   src: "/PPM Decks/Kinder.png",               title: "Kinder",         pdf: "/PPM Decks/Kinder Print Shoot.pdf" },
  { type: "photo", id: "p-kitser",   src: "/Marketing Pitch/kister.png",         title: "Kitser",         pdf: "/Marketing Pitch/Kitser August Sale.pdf" },
  { type: "photo", id: "p-pathan-2", src: "/Movie - OTT pitches/Pathan 2.png",   title: "Pathan Bros",    pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf" },
  { type: "photo", id: "p-deva",     src: "/Marketing Pitch/Deva.png",           title: "Deva",           pdf: "/Marketing Pitch/Deva_s Khayal.pdf" },
  { type: "photo", id: "p-fossil",   src: "/Treatment Notes/fossil.png",          title: "Fossil",         pdf: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf" },
  { type: "photo", id: "p-lifestyle", src: "/Others/life.png",                   title: "Lifestyle",      pdf: "/Others/Lifestyle SS_24 Cast Batch 5 (Bangkok).pdf" },
  { type: "photo", id: "p-bubbling", src: "/Marketing Pitch/the.png",            title: "The Bubbling Fish", pdf: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf" },
  { type: "photo", id: "p-murgi-1",  src: "/Movie - OTT pitches/Murgi.png",      title: "Murgi",          pdf: "/Movie - OTT pitches/Murgi.pdf" },
  { type: "photo", id: "p-pathan-1", src: "/Movie - OTT pitches/Pathan 1.png",   title: "Pathan Bros",    pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf" },
  { type: "photo", id: "p-artkalaa-2", src: "/Marketing Pitch/artkalaa 2.png",   title: "Artkalaa",       pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf" },
];

// ── Video cards (from TXT) ─────────────────────────
interface VideoCard {
  type: "video";
  id: string;
  videoId: number;
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

function buildArchiveLookup(items: ArchiveItem[]): Map<string, ArchiveItem> {
  const map = new Map<string, ArchiveItem>();
  for (const item of items) {
    const id = extractVideoId(item.url);
    if (id) map.set(id, item);
  }
  return map;
}

function parseVideoCards(): VideoCard[] {
  const raw = `1https://www.youtube.com/watch?v=1wqdb9s3kfo
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

  const archiveLookup = buildArchiveLookup(archiveData as ArchiveItem[]);
  const cards: VideoCard[] = [];

  for (const line of raw.trim().split("\n")) {
    const m = line.match(/^(\d+)/);
    if (!m) continue;
    const videoId = parseInt(m[0], 10);
    const url = line.slice(m[0].length).trim();
    if (!url) continue;
    const vidId = extractVideoId(url);
    const arch = vidId ? archiveLookup.get(vidId) : undefined;
    cards.push({
      type: "video",
      id: `v-${videoId}`,
      videoId,
      url,
      title: arch?.title || `Video ${videoId}`,
      brand: arch?.brand || "",
      year: arch?.year || "",
      role: arch?.role || "",
    });
  }
  return cards;
}

const VIDEO_CARDS = parseVideoCards();

// ── Combined + grid spans ──────────────────────────
type Card = PhotoCard | VideoCard;

const ALL: Card[] = [...PHOTO_CARDS, ...VIDEO_CARDS];

const SPANS = [
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 1 }, { col: 2 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 1 }, { col: 2 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 2 }, { col: 1 }, { col: 1 },
  { col: 2 }, { col: 1 }, { col: 1 }, { col: 2 },
  { col: 1 }, { col: 1 },
];

// ── Video card component ───────────────────────────
function WallVideo({ card }: { card: VideoCard }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hasMp4, setHasMp4] = useState(true);
  const [poster, setPoster] = useState<string | undefined>();

  useEffect(() => {
    const img = new Image();
    const jpgUrl = `/assets/videos/${card.videoId}.jpg`;
    img.onload = () => setPoster(jpgUrl);
    img.onerror = () => {
      if (isYoutubeUrl(card.url)) {
        setPoster(getYouTubeThumbnail(card.url) ?? undefined);
      }
    };
    img.src = jpgUrl;

    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", `/assets/videos/${card.videoId}.mp4`, true);
    xhr.onload = () => setHasMp4(xhr.status === 200);
    xhr.onerror = () => setHasMp4(false);
    xhr.send();
  }, [card.videoId, card.url]);

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
        borderRadius: "18px",
        backgroundColor: "#141414",
        aspectRatio: "16 / 9",
        transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s ease, filter 0.4s ease",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        boxShadow: hovered ? "0 16px 56px rgba(0,0,0,0.75)" : "0 6px 28px rgba(0,0,0,0.55)",
        filter: hovered ? "brightness(1.1)" : "brightness(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasMp4 ? (
        <video
          ref={videoRef}
          src={`/assets/videos/${card.videoId}.mp4`}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className="w-full h-full object-cover"
          style={{ display: "block", borderRadius: "18px" }}
        />
      ) : (
        <img
          src={poster || ""}
          alt=""
          className="w-full h-full object-cover"
          style={{ display: "block", borderRadius: "18px" }}
          onError={(e) => {
            const t = e.currentTarget;
            if (t.dataset.fb) return;
            t.dataset.fb = "1";
            t.style.display = "none";
            const fb = t.parentElement?.querySelector<HTMLElement>(".v-fb");
            if (fb) fb.style.display = "flex";
          }}
        />
      )}

      <div className="v-fb absolute inset-0 items-center justify-center" style={{ display: "none", backgroundColor: "#1E1E1E", borderRadius: "18px" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: "rgba(245,245,242,0.2)" }}>
          <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2 17l5-5 3 3 4-4 6 6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Hover overlay */}
      <div
        className="absolute inset-0 pointer-events-none wall-overlay"
        style={{
          borderRadius: "18px",
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Hover title */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none px-5 pb-5 wall-title"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {card.brand && (
          <p className="text-body-sm font-switzer font-[500] text-cinema-white/90">{card.brand}</p>
        )}
        <p className="text-caption font-switzer font-[400]" style={{ color: "rgba(245,245,242,0.6)" }}>
          {card.title}
        </p>
      </div>

      {/* Play icon (always visible, brighter on hover) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: hovered ? 1 : 0.6, transition: "opacity 0.3s ease" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: hovered ? "rgba(200,162,77,0.85)" : "rgba(20,20,20,0.7)",
            transform: hovered ? "scale(1)" : "scale(0.9)",
            transition: "all 0.3s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: hovered ? "#0A0A0A" : "#F5F5F2", marginLeft: "2px" }}>
            <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Photo card component ───────────────────────────
function WallPhoto({ card }: { card: PhotoCard }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: "18px",
        backgroundColor: "#141414",
        aspectRatio: "16 / 9",
        transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s ease, filter 0.4s ease",
        transform: hovered ? "scale(1.04)" : "scale(1)",
        boxShadow: hovered ? "0 16px 56px rgba(0,0,0,0.75)" : "0 6px 28px rgba(0,0,0,0.55)",
        filter: hovered ? "brightness(1.1)" : "brightness(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={card.src}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
        style={{ display: "block", borderRadius: "18px" }}
      />
      <div
        className="absolute inset-0 pointer-events-none wall-overlay"
        style={{
          borderRadius: "18px",
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 50%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none px-5 pb-5 wall-title"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <p className="text-body-sm font-switzer font-[400] text-cinema-white/90">
          {card.title}
        </p>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────
export default function ProductionWall() {
  const [show, setShow] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)));
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full relative py-20 md:py-28"
      style={{ backgroundColor: "#0b0b0b" }}
    >
      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.035,
        }}
      />

      <div className="relative z-10 max-w-[1500px] mx-auto px-8 md:px-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">
            Production Archive
          </p>
          <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">
            The Wall
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-5 md:gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {ALL.map((card, i) => {
            const span = SPANS[i % SPANS.length];
            return (
              <div
                key={card.id}
                style={{
                  gridColumn: `span ${span.col}`,
                  opacity: 0,
                  animation: show
                    ? `cardEntrance 0.7s ease-out ${Math.min(i * 0.07, 1.5)}s forwards`
                    : "none",
                }}
                onClick={() => {
                  if (card.type === "photo" && card.pdf) window.open(card.pdf, "_blank");
                  if (card.type === "video") window.open(card.url, "_blank");
                }}
              >
                {card.type === "photo" ? <WallPhoto card={card} /> : <WallVideo card={card} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
