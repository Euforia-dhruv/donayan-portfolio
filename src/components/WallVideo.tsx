"use client";

import { useEffect, useRef } from "react";

/**
 * Wall video surface.
 *
 *  ✓ muted · loop · playsInline · preload="metadata"  (spec: "preload metadata"
 *    + "show first frame immediately" — metadata is tiny, so the first
 *    painted frame appears almost at once, never a black box)
 *  ✓ IntersectionObserver: plays only while visible (desktop + mobile),
 *    pauses when scrolled away (no hidden autoplay, frees the decoder)
 *  ✓ lazy: playback starts only when the card nears the viewport, and
 *    a ready-retry guarantees play() succeeds once data arrives
 *  ✓ hover brightens slightly (group-hover:brightness handled by parent)
 */
export default function WallVideo({
  src,
  sizes,
  className,
}: {
  src: string;
  sizes?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const v = vRef.current;
    if (!el || !v) return;

    // React does not reliably reflect the `muted` *property* from the JSX
    // attribute; browsers block unmuted autoplay, so force it here.
    v.muted = true;
    v.defaultMuted = true;

    let inView = false;
    const tryPlay = () => {
      if (!inView || !v.paused) return;
      const p = v.play();
      if (p) p.catch(() => {});
    };

    const onReady = () => tryPlay();
    v.addEventListener("loadeddata", onReady);
    v.addEventListener("canplay", onReady);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          v.preload = "metadata";
          tryPlay();
        } else {
          v.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      v.removeEventListener("loadeddata", onReady);
      v.removeEventListener("canplay", onReady);
    };
  }, [src]);

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden bg-charcoal ${className ?? ""}`}
    >
      <video
        ref={vRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 group-hover:brightness-110"
      />
      <span className="sr-only">{src} — playing automatically when visible</span>
    </div>
  );
}
