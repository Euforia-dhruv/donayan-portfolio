"use client";

import { useEffect, useRef } from "react";

/**
 * Wall video surface.
 *
 *  ✓ autoplay · muted · loop · playsInline · preload=metadata
 *  ✓ IntersectionObserver: plays only while visible (desktop + mobile),
 *    pauses when scrolled away (no hidden autoplay, frees the decoder)
 *  ✓ lazy: metadata is fetched only once the card nears the viewport
 *  ✓ shows the first frame immediately (browsers paint frame 0 on metadata)
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

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.muted = true;
          v.preload = "metadata";
          const p = v.play();
          if (p) p.catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
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
        autoPlay
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-500 group-hover:brightness-110"
      />
      {/* 9:16 / 1:1 trailers carry no audio; the first painted frame is
          the poster, so there is never a black box. */}
      <span className="sr-only">{src} — playing automatically when visible</span>
    </div>
  );
}
