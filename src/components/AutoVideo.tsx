"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Wall video surface that AUTOplays on loop (muted, playsInline) and pauses
 * when scrolled offscreen to protect performance. A poster image is shown
 * (blurred) until the first frame paints, so there is never a black box.
 */
export default function AutoVideo({
  src,
  poster,
  sizes,
  mode,
  className,
}: {
  src: string;
  poster?: string | null;
  sizes?: string;
  mode?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    const v = vRef.current;
    if (!el || !v) return;
    // React does not reliably set the `muted` DOM *property* from the JSX
    // attribute, and browsers block autoplay of unmuted video. Force it here
    // so the autoplay/loop actually starts.
    v.muted = true;
    v.defaultMuted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.muted = true;
          v.preload = "auto";
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "250px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden bg-charcoal ${className ?? ""}`}>
      {poster && (
        <Image
          src={poster}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          className={`object-cover transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        />
      )}
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
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}
