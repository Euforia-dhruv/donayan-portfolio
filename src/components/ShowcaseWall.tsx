"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { getMediaUrl } from "@/lib/media";
import {
  getYouTubeAutoplayUrl,
  getYouTubeThumbnail,
  getYouTubeId,
  getPlatformLabel,
  getDurationLabel,
  isEmbeddable,
} from "@/lib/video-utils";
import archive from "@/data/archive.json";
import galleryCards from "@/data/gallery-cards.json";

interface ShowcaseProject {
  id: string;
  title: string;
  client: string;
  year: string;
  type: string;
  platform: string | null;
  thumbnail: string;
  video: string;
  aspect: string;
  doc?: string;
}

function getAspect(url: string, type: string): string {
  if (url.includes("youtube.com/shorts") || url.includes("youtu.be/shorts")) return "9:16";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "16:9";
  if (url.includes("instagram.com/reel")) return "9:16";
  if (url.includes("instagram.com/p")) return "4:5";
  if (type === "document") return "4:5";
  return "16:9";
}

function getProjectType(url: string, fallback: string): string {
  if (!url) return "Document";
  return getDurationLabel(url) || fallback;
}

function getProjectPlatform(url: string): string | null {
  if (!url) return null;
  return getPlatformLabel(url) || "MP4";
}

const localVideoFiles: { title: string; client: string; year: string; type: string; file: string; aspect: string }[] = [
  { title: "Beauty Campaign", client: "Skinn Titan", year: "2024", type: "Campaign", file: "Skinn_Noura_a_gift_from_you,_to_you_💕_Skinn_Titan_1080p,_h264.mp4", aspect: "9:16" },
  { title: "Brand Film", client: "Motivational", year: "2024", type: "Film", file: "With_good_always_comes_bad_With_growth_always_comes_pain_You_cannot.mp4", aspect: "9:16" },
  { title: "Fashion Campaign", client: "IDÉE Eyewear", year: "2025", type: "Campaign", file: "Grade_for_with_@ideeeyewear_with_@quitquick_@sspillai_@jatinkampani.mp4", aspect: "9:16" },
  { title: "Brand Campaign", client: "Made For This", year: "2025", type: "Film", file: "MADE_FOR_GREEN_LIGHTING_YOUR_PASSIONS_AND_PASSENGERS_#MadeForThis.mp4", aspect: "16:9" },
  { title: "Promo", client: "The Night Manager", year: "2024", type: "Reel", file: "The_Night_Manager_Pranks_Guests_Aditya_Roy_Kapoor_Now_Streaming.mp4", aspect: "16:9" },
  { title: "Fashion Campaign", client: "Fashion Glam", year: "2024", type: "Campaign", file: 'Glam_that_has_you_singing_\u201CI_want_it_that_way\u201D\ud83d\ude09Slay_your_look_for.mp4', aspect: "9:16" },
  { title: "Fashion Campaign", client: "Armani Exchange", year: "2024", type: "Campaign", file: "Shake things up with #AXtime#AXSS24 @armaniexchange.mp4", aspect: "9:16" },
  { title: "Commercial", client: "Aarohi Loans", year: "2025", type: "Film", file: "Aapke_har_bade_sapne_ka_bharosemand_saathi!_Aarohi_Loans_for_Women.mp4", aspect: "9:16" },
];

const localFiles: ShowcaseProject[] = localVideoFiles.map((f, i) => ({
  id: `local-${i + 1}`,
  title: f.title,
  client: f.client,
  year: f.year,
  type: f.type,
  platform: "MP4",
  thumbnail: "",
  video: `/videos/${encodeURIComponent(f.file)}`,
  aspect: f.aspect,
}));

const documentProjects: ShowcaseProject[] = [
  { id: "doc-sprite", title: "Heat Happens", client: "Sprite", year: "2024", type: "Document", platform: null, thumbnail: "/PPM Decks/Sprite.png", video: "", aspect: "4:5", doc: "/PPM Decks/Sprite PPM.pdf" },
  { id: "doc-centrum", title: "Claims Campaign", client: "Centrum", year: "2025", type: "Document", platform: null, thumbnail: "/PPM Decks/Centrum.png", video: "", aspect: "4:5", doc: "/PPM Decks/Centrum Claim PPM Deck - 10 Oct (1).pdf" },
  { id: "doc-ax", title: "Celebrity Shoot SS'25", client: "Armani Exchange", year: "2025", type: "Document", platform: null, thumbnail: "/PPM Decks/AX.png", video: "", aspect: "4:5", doc: "/PPM Decks/AX Celebrity Shoot SS_25.pdf" },
  { id: "doc-idee", title: "IDEE Campaign", client: "IDÉE", year: "2025", type: "Document", platform: null, thumbnail: "/PPM Decks/IDEE.png", video: "", aspect: "4:5", doc: "/PPM Decks/IDEE PPM.pdf" },
  { id: "doc-hdfc", title: "KVS Campaign", client: "HDFC", year: "2024", type: "Document", platform: null, thumbnail: "/PPM Decks/HDFC.png", video: "", aspect: "4:5", doc: "/PPM Decks/HDFC KVS Post PPM Deck.pdf" },
  { id: "doc-kinder", title: "Print Shoot", client: "Kinder", year: "2025", type: "Document", platform: null, thumbnail: "/PPM Decks/Kinder.png", video: "", aspect: "4:5", doc: "/PPM Decks/Kinder Print Shoot.pdf" },
  { id: "doc-fossil", title: "SS'25 PPM Deck", client: "Fossil", year: "2024", type: "Document", platform: null, thumbnail: "/Treatment Notes/Fossil.png", video: "", aspect: "4:5", doc: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf" },
  { id: "doc-godrej", title: "Director's Note", client: "Godrej Capital", year: "2025", type: "Document", platform: null, thumbnail: "/Treatment Notes/godrej.png", video: "", aspect: "4:5", doc: "/Treatment Notes/Godrej Capital - Director_s Note.pdf" },
  { id: "doc-ponds", title: "BB Cream Treatment", client: "Pond's", year: "2025", type: "Document", platform: null, thumbnail: "/Treatment Notes/ponds.png", video: "", aspect: "4:5", doc: "/Treatment Notes/Ponds  BB cream TN.pdf" },
  { id: "doc-tanishq", title: "Rivaah Casting", client: "Tanishq", year: "2024", type: "Document", platform: null, thumbnail: "/Others/Tanishq.png", video: "", aspect: "4:5", doc: "/Others/Tanishq Casting.pdf" },
  { id: "doc-lifestyle", title: "SS'24 Casting Bangkok", client: "Lifestyle", year: "2024", type: "Document", platform: null, thumbnail: "/Others/lifestyle.png", video: "", aspect: "4:5", doc: "/Others/Lifestyle SS_24 Cast Batch 5 (Bangkok).pdf" },
  { id: "doc-murgi-1", title: "Film Pitch", client: "Murgi", year: "2024", type: "Document", platform: null, thumbnail: "/Movie - OTT pitches/Murgi.png", video: "", aspect: "4:5", doc: "/Movie - OTT pitches/Murgi.pdf" },
  { id: "doc-murgi-2", title: "Film Pitch", client: "Murgi", year: "2024", type: "Document", platform: null, thumbnail: "/Movie - OTT pitches/Murgi 1.png", video: "", aspect: "4:5", doc: "/Movie - OTT pitches/Murgi.pdf" },
  { id: "doc-pathan-1", title: "Series Pitch", client: "Pathan Brothers", year: "2024", type: "Document", platform: null, thumbnail: "/Movie - OTT pitches/Pathan 1.png", video: "", aspect: "4:5", doc: "/Movie - OTT pitches/Pathan Brothers Series.pdf" },
  { id: "doc-pathan-2", title: "Series Pitch", client: "Pathan Brothers", year: "2024", type: "Document", platform: null, thumbnail: "/Movie - OTT pitches/Pathan 2.png", video: "", aspect: "4:5", doc: "/Movie - OTT pitches/Pathan Brothers Series.pdf" },
  { id: "doc-artkalaa-1", title: "Pitch Deck", client: "Artkalaa", year: "2024", type: "Document", platform: null, thumbnail: "/Marketing Pitch/artkalaa.png", video: "", aspect: "4:5", doc: "/Marketing Pitch/Artkalaa Pitch Deck.pdf" },
  { id: "doc-artkalaa-2", title: "Brand Strategy", client: "Artkalaa", year: "2024", type: "Document", platform: null, thumbnail: "/Marketing Pitch/artkalaa 2.png", video: "", aspect: "4:5", doc: "/Marketing Pitch/Artkalaa Pitch Deck.pdf" },
  { id: "doc-oool", title: "Digital Strategy", client: "OOOL", year: "2024", type: "Document", platform: null, thumbnail: "/Marketing Pitch/oool.png", video: "", aspect: "4:5", doc: "/Marketing Pitch/OOOL Digital Strategy.pdf" },
  { id: "doc-kitser", title: "August Sale", client: "Kitser", year: "2024", type: "Document", platform: null, thumbnail: "/Marketing Pitch/kister.png", video: "", aspect: "4:5", doc: "/Marketing Pitch/Kitser August Sale.pdf" },
  { id: "doc-deva", title: "Marketing Pitch", client: "Deva's Khayal", year: "2024", type: "Document", platform: null, thumbnail: "/Marketing Pitch/Deva.png", video: "", aspect: "4:5", doc: "/Marketing Pitch/Deva_s Khayal.pdf" },
  { id: "doc-justbe", title: "Brand Campaign", client: "Just Be", year: "2024", type: "Document", platform: null, thumbnail: "/Marketing Pitch/Just be.png", video: "", aspect: "4:5", doc: "/Marketing Pitch/Just Be.pdf" },
  { id: "doc-bubbling", title: "Marketing Plan", client: "The Bubbling Fish & Nirala", year: "2024", type: "Document", platform: null, thumbnail: "/Marketing Pitch/the.png", video: "", aspect: "4:5", doc: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf" },
];

function buildProjects(): ShowcaseProject[] {
  const items: ShowcaseProject[] = [];
  const seen = new Set<string>();

  archive.forEach((a) => {
    if (!a.url) return;
    const key = a.url.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    items.push({
      id: a.id,
      title: a.title,
      client: a.brand,
      year: a.year,
      type: getProjectType(a.url, a.category),
      platform: getProjectPlatform(a.url),
      thumbnail: a.thumbnail || getYouTubeThumbnail(a.url) || "",
      video: a.url,
      aspect: getAspect(a.url, a.type),
    });
  });

  localFiles.forEach((f) => {
    items.push(f);
  });

  documentProjects.forEach((p) => {
    items.push(p);
  });

  galleryCards.forEach((c) => {
    const matched = archive.find((a) => a.brand.toLowerCase() === c.brand.toLowerCase() && a.url);
    if (matched && seen.has(matched.url.toLowerCase())) return;
    const existingDoc = documentProjects.find((p) => p.client.toLowerCase() === c.brand.toLowerCase());
    if (existingDoc) return;
    items.push({
      id: `wall-${c.id}`,
      title: c.label,
      client: c.brand,
      year: c.year,
      type: "Document",
      platform: null,
      thumbnail: (c as any).thumb || (matched ? getYouTubeThumbnail(matched.url) || "" : ""),
      video: matched?.url || "",
      aspect: "4:5",
      doc: c.doc,
    });
  });

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function ShowcaseCard({
  project,
  index,
  onSelect,
}: {
  project: ShowcaseProject;
  index: number;
  onSelect: (p: ShowcaseProject) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const delay = Math.min(index * 0.05, 1.5);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.unobserve(el);
        }
      },
      { rootMargin: "100px", threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (project.video.includes("youtube.com") || project.video.includes("youtu.be")) {
      const url = getYouTubeAutoplayUrl(project.video);
      if (url && iframeRef.current) iframeRef.current.src = url;
    } else if (project.video.endsWith(".mp4") && videoRef.current) {
      videoRef.current.play();
    }
  }, [project.video]);

  const isVideo = !project.video.endsWith(".mp4") && (project.video.includes("youtube.com") || project.video.includes("youtu.be") || project.video.includes("instagram.com"));
  const isMP4 = project.video.endsWith(".mp4");
  const isYouTube = project.video.includes("youtube.com") || project.video.includes("youtu.be");
  const hasVideo = isVideo || isMP4;

  return (
    <div
      ref={ref}
      className="break-inside-avoid mb-4 md:mb-5 relative group cursor-pointer"
      style={{
        opacity: 0,
        transform: "translateY(40px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        transitionDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(project)}
    >
      <div
        className="relative w-full overflow-hidden bg-smoke"
        style={{ aspectRatio: project.aspect }}
      >
        {project.thumbnail && (
          <img
            src={getMediaUrl(project.thumbnail)}
            alt={project.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[350ms] ease-out ${
              imgLoaded ? "opacity-100" : "opacity-0"
            } ${hovered ? "scale-105" : "scale-100"}`}
            style={{ filter: hovered ? "brightness(0.6)" : "brightness(0.95)" }}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
        )}

        {!project.thumbnail && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-smoke to-charcoal">
            <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] px-4 text-center leading-[1.3]">
              {project.client}
            </p>
          </div>
        )}

        {isYouTube && (
          <iframe
            ref={iframeRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            allow="autoplay; encrypted-media; picture-in-picture"
            title={project.title}
            style={{ filter: "brightness(0.85)" }}
          />
        )}

        {isMP4 && (
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ filter: "brightness(0.85)" }}
          />
        )}

        {project.platform && (
          <div className="absolute top-2 left-2 px-2 py-0.5 text-caption font-switzer font-[400] uppercase tracking-[0.02em] leading-[1.2] bg-cinema-black/70 text-cinema-white/80">
            {project.platform}
          </div>
        )}

        {project.type && (
          <div className="absolute top-2 right-2 px-2 py-0.5 text-caption font-switzer font-[400] uppercase tracking-[0.02em] leading-[1.2] bg-cinema-black/70 text-cinema-white/80">
            {project.type}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-cinema-black/80 via-cinema-black/20 to-transparent">
          <p className="text-caption font-switzer font-[400] text-cinema-white leading-[1.2] truncate">
            {project.client}
          </p>
          <p className="text-[10px] font-switzer font-[400] text-cinema-white/50 truncate">
            {project.title} · {project.year}
          </p>
        </div>
      </div>
    </div>
  );
}

function VideoModal({
  project,
  onClose,
}: {
  project: ShowcaseProject;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlay = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const isYouTube = project.video.includes("youtube.com") || project.video.includes("youtu.be");
  const isMP4 = project.video.endsWith(".mp4");

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cinema-black/95 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={handleOverlay}
    >
      <div
        className="relative w-full max-w-5xl mx-4 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-cinema-white/60 hover:text-cinema-white text-caption font-switzer uppercase tracking-[0.02em] bg-transparent border-none cursor-pointer transition-colors z-10"
        >
          Close [ESC]
        </button>
        <p className="text-body-sm font-switzer font-[400] text-cinema-white/50 mb-3 truncate pr-20">
          {project.client} — {project.title}
        </p>
        <div className="relative bg-smoke overflow-hidden" style={{ aspectRatio: project.aspect }}>
          {isYouTube ? (
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeId(project.video)}?rel=0&modestbranding=1&autoplay=1`}
              title={project.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isMP4 ? (
            <video
              src={project.video}
              className="w-full h-full object-contain"
              autoPlay
              controls
              playsInline
            />
          ) : project.video.includes("instagram.com") ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-body-sm font-switzer font-[400] text-stone mb-4">
                  Open on Instagram to view
                </p>
                <a
                  href={project.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-cinema-black text-caption font-switzer font-[400] uppercase tracking-[0.02em] no-underline"
                  style={{ borderRadius: "1440px" }}
                >
                  Open on Instagram
                </a>
              </div>
            </div>
          ) : project.doc ? (
            <div className="w-full h-full flex items-center justify-center">
              <a
                href={project.doc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-cinema-black text-caption font-switzer font-[400] uppercase tracking-[0.02em] no-underline"
                style={{ borderRadius: "1440px" }}
              >
                Open Document
              </a>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-stone text-caption font-switzer">No preview available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShowcaseWall() {
  const [selected, setSelected] = useState<ShowcaseProject | null>(null);
  const projects = useMemo(() => buildProjects(), []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      <section className="py-20 md:py-28 bg-cinema-black border-t border-cinema-white/8">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8">
          <div className="mb-12 md:mb-16">
            <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">
              The Archive
            </p>
            <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] mt-2">
              Showcase
            </h2>
          </div>

          <div
            className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-5"
            style={{ columnFill: "balance" }}
          >
            {projects.map((p, i) => (
              <ShowcaseCard key={p.id} project={p} index={i} onSelect={setSelected} />
            ))}
          </div>
        </div>
      </section>

      {selected && <VideoModal project={selected} onClose={handleClose} />}
    </>
  );
}
