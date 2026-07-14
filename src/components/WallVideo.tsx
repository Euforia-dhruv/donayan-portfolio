"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wall video: lazy-mounted, autoplay muted loop playsInline.
 * - Mounts only when near the viewport (preload="none" until then).
 * - Plays when visible, pauses when scrolled away, resumes when back.
 * - Starts slightly blurred, sharpens once the first frame decodes.
 * - Native controls appear only on hover (no permanent play button).
 */
export default function WallVideo({
  src,
  poster,
  hovered,
  priority,
}: {
  src: string;
  poster?: string | null;
  hovered: boolean;
  priority?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(!!priority);

  useEffect(() => {
    if (mounted) return;
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.preload = "auto";
          const p = v.play();
          if (p) p.catch(() => {});
        } else {
          v.pause();
        }
      },
      { root: null, rootMargin: "250px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted, src]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-black">
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: ready ? 0 : 1, filter: "blur(12px)", transform: "scale(1.05)" }}
        />
      )}
      {!ready && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-charcoal to-black" />
      )}
      {mounted && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          controls={hovered}
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-700"
          style={{ opacity: ready ? 1 : 0, filter: ready ? "blur(0px)" : "blur(10px)" }}
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  );
}
