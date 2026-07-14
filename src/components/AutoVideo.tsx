"use client";

import { useEffect, useRef, useState } from "react";

interface AutoVideoProps {
  src: string;
  poster?: string;
  className?: string;
  priority?: boolean;
  /** autoplay: play as soon as the card is in/near the viewport. hover: play only on hover. */
  mode?: "autoplay" | "hover";
  sizes?: string;
}

/**
 * Cinematic background video.
 * - Always muted + loop + playsInline + autoplay (when in view) so it never crops to a black box.
 * - object-cover fills the card; because the card aspect ratio matches the source, nothing is cropped.
 * - Lazily loads: preload stays "none" until the card is within ~80vh of the viewport, then bumps to "auto".
 * - A blurred poster shows instantly (blur-up) until the first frame decodes.
 */
export default function AutoVideo({
  src,
  poster,
  className = "",
  priority = false,
  mode = "autoplay",
}: AutoVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(priority);

  // Mount the <video> only once it is near the viewport (or immediately if priority).
  useEffect(() => {
    if (mode !== "autoplay" || mounted) return;
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          obs.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mode, mounted]);

  // Lazy autoplay: play when visible, pause when far away (browser may still throttle).
  useEffect(() => {
    if (mode !== "autoplay" || !mounted) return;
    const el = wrapRef.current;
    const video = videoRef.current;
    if (!el || !video) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = "auto";
          setActive(true);
          const p = video.play();
          if (p) p.catch(() => {});
        } else {
          setActive(false);
          video.pause();
        }
      },
      { root: null, rootMargin: "300px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mode, mounted, src]);

  const onEnter = () => {
    if (mode !== "hover") return;
    const v = videoRef.current;
    if (!v) return;
    v.preload = "auto";
    setActive(true);
    const p = v.play();
    if (p) p.catch(() => {});
  };
  const onLeave = () => {
    if (mode !== "hover") return;
    setActive(false);
    const v = videoRef.current;
    if (v) v.pause();
  };

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden bg-black ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Blur-up poster */}
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover transition-opacity duration-500"
          style={{
            opacity: ready ? 0 : 1,
            filter: "blur(14px)",
            transform: "scale(1.1)",
          }}
        />
      )}

      {/* Skeleton shimmer until the first frame is ready */}
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
          preload="none"
          // autoPlay helps for first paint in autoplay mode once mounted
          autoPlay={mode === "autoplay"}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
        />
      )}
    </div>
  );
}
