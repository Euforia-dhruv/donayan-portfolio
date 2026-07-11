"use client";

import { useEffect, useCallback, useState } from "react";
import { getYouTubeEmbedUrl } from "@/lib/video-utils";

interface VideoModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function VideoModal({ url, title, onClose }: VideoModalProps) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(url, true);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      clearTimeout(timer);
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-cream-paper/60 hover:text-cream-paper font-geist uppercase bg-transparent border-none cursor-pointer transition-colors z-10"
          style={{ fontSize: "13px", letterSpacing: "0.15em" }}
        >
          Close [ESC]
        </button>

        <p className="font-geist font-[400] text-cream-paper/50 mb-3 truncate pr-20" style={{ fontSize: "14px" }}>
          {title}
        </p>

        <div className="relative aspect-video bg-dew-drop rounded-xl overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
            </div>
          )}
          {embedUrl && (
            <iframe
              src={embedUrl}
              title={title}
              className={`w-full h-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
