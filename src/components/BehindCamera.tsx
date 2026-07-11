"use client";

import { useState } from "react";
import archive from "@/data/archive.json";
import VideoModal from "@/components/VideoModal";
import { getYouTubeThumbnail } from "@/lib/video-utils";

const btsEntries = archive.filter(
  (a) =>
    a.url &&
    (a.category === "Behind the Scenes" || a.category === "Music Videos" || a.category === "Brand Films")
);

const btsCards = [
  { label: "DIRECTOR MONITOR", sub: "Camera Review", icon: "monitor" },
  { label: "LIGHTING SETUP", sub: "Studio Configuration", icon: "light" },
  { label: "CAMERA MOVEMENT", sub: "Tracking Shot", icon: "camera" },
  { label: "SET PREPARATION", sub: "Pre-Production", icon: "set" },
  { label: "CREW MOMENT", sub: "Behind the Scenes", icon: "crew" },
  { label: "PRODUCTION MEETING", sub: "Pre-Production", icon: "meeting" },
];

export default function BehindCamera() {
  const [video, setVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <>
      <section className="py-20 md:py-28 bg-cinema-black border-t border-white/5" id="bts">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 mb-10">
          <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-3">
                    Production Life
          </p>
          <h2 className="text-display md:text-heading-lg font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white text-balance">
            Behind the Camera
          </h2>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {btsCards.map((card, i) => {
              const entry = btsEntries[i % btsEntries.length];
              const thumb = entry ? getYouTubeThumbnail(entry.url) : null;

              return (
                <button
                  key={card.label}
                  onClick={() => {
                    if (entry) setVideo({ url: entry.url, title: entry.title });
                  }}
                  className="group bg-transparent border-none cursor-pointer p-0 text-left"
                >
                  <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-smoke">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={card.label}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-charcoal to-smoke flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-stone/30">
                          <path d="M23 7l-7 5 7 5V7z" stroke="currentColor" strokeWidth="1.2" />
                          <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-cinema-black/0 group-hover:bg-cinema-black/50 transition-all duration-500 flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-champagne/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                          <path d="M8 5v14l11-7L8 5z" fill="#0B0B0B" />
                        </svg>
                      </div>
                    </div>

                    {/* Label overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-cinema-black/80 to-transparent">
                      <p className="text-caption font-sans font-[500] text-cinema-white uppercase tracking-[0.15em] leading-[1.2]">
                        {card.label}
                      </p>
                      <p className="text-[9px] font-sans font-[400] text-cinema-white/50 uppercase tracking-[0.1em] mt-0.5">
                        {card.sub}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {video && (
        <VideoModal
          url={video.url}
          title={video.title}
          onClose={() => setVideo(null)}
        />
      )}
    </>
  );
}
