"use client";

import { useRef, useEffect, useMemo } from "react";
import archiveData from "@/data/archive.json";
import { getYouTubeAutoplayUrl } from "@/lib/video-utils";

interface WallProject {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  image: string;
  aspect: string;
}

const projects: WallProject[] = [
  { id: "p-sprite", title: "Heat Happens", client: "Sprite", year: "2024", category: "Commercial Film", image: "/PPM Decks/Sprite.png", aspect: "4:3" },
  { id: "p-centrum", title: "Claims Campaign", client: "Centrum", year: "2025", category: "Commercial Film", image: "/PPM Decks/Centrum.png", aspect: "16:9" },
  { id: "p-ax", title: "Celebrity Shoot SS'25", client: "Armani Exchange", year: "2025", category: "Fashion Campaign", image: "/PPM Decks/AX.png", aspect: "4:5" },
  { id: "p-idee", title: "Brand Campaign", client: "IDÉE Eyewear", year: "2025", category: "Fashion Campaign", image: "/PPM Decks/IDEE.png", aspect: "4:3" },
  { id: "p-hdfc", title: "KVS Campaign", client: "HDFC", year: "2024", category: "Brand Film", image: "/PPM Decks/HDFC.png", aspect: "16:9" },
  { id: "p-kinder", title: "Print Shoot", client: "Kinder", year: "2025", category: "Commercial Film", image: "/PPM Decks/Kinder.png", aspect: "4:3" },
  { id: "p-fossil", title: "SS'25 Campaign", client: "Fossil", year: "2024", category: "Fashion Campaign", image: "/Treatment Notes/Fossil.png", aspect: "4:5" },
  { id: "p-godrej", title: "Capital Campaign", client: "Godrej Capital", year: "2025", category: "Brand Film", image: "/Treatment Notes/godrej.png", aspect: "4:3" },
  { id: "p-ponds", title: "BB Cream Campaign", client: "Pond's", year: "2025", category: "Commercial Film", image: "/Treatment Notes/ponds.png", aspect: "16:9" },
  { id: "p-tanishq", title: "Rivaah Collection", client: "Tanishq", year: "2024", category: "Celebrity Campaign", image: "/Others/Tanishq.png", aspect: "3:4" },
  { id: "p-lifestyle", title: "SS'24 Bangkok Casting", client: "Lifestyle", year: "2024", category: "Fashion Campaign", image: "/Others/lifestyle.png", aspect: "4:3" },
  { id: "p-artkalaa", title: "Brand Pitch", client: "Artkalaa", year: "2024", category: "Brand Film", image: "/Marketing Pitch/artkalaa.png", aspect: "4:5" },
  { id: "p-artkalaa-2", title: "Brand Strategy", client: "Artkalaa", year: "2024", category: "Brand Film", image: "/Marketing Pitch/artkalaa 2.png", aspect: "1:1" },
  { id: "p-oool", title: "Digital Strategy", client: "OOOL", year: "2024", category: "Digital Campaign", image: "/Marketing Pitch/oool.png", aspect: "4:3" },
  { id: "p-kitser", title: "August Sale", client: "Kitser", year: "2024", category: "Digital Campaign", image: "/Marketing Pitch/kister.png", aspect: "3:4" },
  { id: "p-deva", title: "Marketing Pitch", client: "Deva's Khayal", year: "2024", category: "Music Video", image: "/Marketing Pitch/Deva.png", aspect: "4:5" },
  { id: "p-justbe", title: "Brand Campaign", client: "Just Be", year: "2024", category: "Brand Film", image: "/Marketing Pitch/Just be.png", aspect: "16:9" },
  { id: "p-bubbling", title: "Marketing Plan", client: "The Bubbling Fish & Nirala", year: "2024", category: "Brand Film", image: "/Marketing Pitch/the.png", aspect: "4:5" },
  { id: "p-murgi-1", title: "Film Pitch", client: "Murgi", year: "2024", category: "Film", image: "/Movie - OTT pitches/Murgi.png", aspect: "4:5" },
  { id: "p-murgi-2", title: "Film Treatment", client: "Murgi", year: "2024", category: "Film", image: "/Movie - OTT pitches/Murgi 1.png", aspect: "9:16" },
  { id: "p-pathan-1", title: "Series Pitch", client: "Pathan Brothers", year: "2024", category: "Series", image: "/Movie - OTT pitches/Pathan 1.png", aspect: "4:5" },
  { id: "p-pathan-2", title: "Series Treatment", client: "Pathan Brothers", year: "2024", category: "Series", image: "/Movie - OTT pitches/Pathan 2.png", aspect: "3:4" },
];

const localVideos = [
  { src: "/videos/Skinn_Noura_a_gift_from_you,_to_you_💕_Skinn_Titan_1080p,_h264.mp4", brand: "Skinn Titan", label: "Beauty Campaign" },
  { src: "/videos/With_good_always_comes_bad_With_growth_always_comes_pain_You_cannot.mp4", brand: "Motivational", label: "Brand Film" },
  { src: "/videos/Grade_for_with_@ideeeyewear_with_@quitquick_@sspillai_@jatinkampani.mp4", brand: "IDÉE Eyewear", label: "Fashion Campaign" },
  { src: "/videos/MADE_FOR_GREEN_LIGHTING_YOUR_PASSIONS_AND_PASSENGERS_#MadeForThis.mp4", brand: "Made For This", label: "Brand Film" },
  { src: "/videos/The_Night_Manager_Pranks_Guests_Aditya_Roy_Kapoor_Now_Streaming.mp4", brand: "The Night Manager", label: "Promo" },
  { src: "/videos/Glam_that_has_you_singing_“I_want_it_that_way”😉Slay_your_look_for.mp4", brand: "Fashion Glam", label: "Fashion Campaign" },
  { src: "/videos/Shake things up with #AXtime#AXSS24 @armaniexchange.mp4", brand: "Armani Exchange", label: "Fashion Campaign" },
  { src: "/videos/Aapke_har_bade_sapne_ka_bharosemand_saathi!_Aarohi_Loans_for_Women.mp4", brand: "Aarohi Loans", label: "Commercial" },
];

const youtubeArchive = archiveData.filter((a) => a.url && (a.url.includes("youtube.com") || a.url.includes("youtu.be")));

function VideoReel() {
  return (
    <div className="relative z-10 mb-20 md:mb-28 overflow-hidden">
      <div className="flex gap-4 overflow-x-auto px-8 md:px-10 pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {localVideos.map((v, i) => (
          <div key={i} className="flex-shrink-0 w-[180px] md:w-[220px] snap-start">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-smoke border border-cinema-white/5">
              <video src={v.src} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        ))}
        {youtubeArchive.map((a) => {
          const embedUrl = getYouTubeAutoplayUrl(a.url);
          if (!embedUrl) return null;
          return (
            <div key={a.id} className="flex-shrink-0 w-[180px] md:w-[220px] snap-start">
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-smoke border border-cinema-white/5">
                <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WallCard({ project, index }: { project: WallProject; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const delay = Math.min(index * 0.06, 1.5);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          obs.unobserve(el);
        }
      },
      { rootMargin: "80px", threshold: 0.01 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="break-inside-avoid mb-5 md:mb-6 group cursor-pointer"
      style={{
        opacity: 0,
        transform: "translateY(40px)",
        transition: `opacity 0.7s ease, transform 0.7s ease`,
        transitionDelay: `${delay}s`,
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-smoke"
        style={{
          aspectRatio: project.aspect,
          borderRadius: "11px",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <img
          src={project.image}
          alt={`${project.client} — ${project.title}`}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/80 via-cinema-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <p className="text-caption font-switzer font-[400] text-cinema-white/70 uppercase tracking-[0.02em] mb-0.5">
              {project.category}
            </p>
            <p className="text-body-sm font-switzer font-[400] text-cinema-white leading-[1.2]">
              {project.client} <span className="text-cinema-white/50">· {project.year}</span>
            </p>
            <p className="text-caption font-switzer font-[300] text-cinema-white/50 mt-0.5">
              {project.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductionWall() {
  const shuffled = useMemo(() => {
    const arr = [...projects];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  return (
    <section id="wall" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0A0A0A 0%, #141414 40%, #1A1A1A 70%, #0A0A0A 100%)" }}
    >
      <div className="absolute inset-0 paper-bg pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-8 md:px-10 mb-14 md:mb-18">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">Production Archive</p>
        <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">The Wall</h2>
      </div>

      <VideoReel />

      <div className="relative z-10 max-w-[1440px] mx-auto px-8 md:px-10">
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5 md:gap-6" style={{ columnFill: "balance" }}>
          {shuffled.map((p, i) => (
            <WallCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
