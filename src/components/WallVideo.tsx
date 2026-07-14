"use client";

import { useEffect, useRef } from "react";

/**
 * Poster surface for a video: shows the first frame WITHOUT autoplaying.
 * - preload="metadata" loads only the first frame (no full video buffer).
 * - Seeking to a tiny time forces the browser to paint a frame.
 * - No autoplay, no controls: it is purely a poster. Clicking is handled
 *   by the parent (which opens a lightbox that loads + plays on demand).
 */
export default function PosterFrame({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const paint = () => {
      try {
        if (v.readyState >= 1) v.currentTime = 0.1;
      } catch {
        /* some browsers disallow seeking before play; ignore */
      }
    };
    v.addEventListener("loadedmetadata", paint);
    v.addEventListener("seeked", paint);
    return () => {
      v.removeEventListener("loadedmetadata", paint);
      v.removeEventListener("seeked", paint);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="metadata"
      disablePictureInPicture
      disableRemotePlayback
      className="absolute inset-0 h-full w-full bg-black object-cover"
    />
  );
}
