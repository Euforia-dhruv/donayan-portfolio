"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import galleryCards from "@/data/gallery-cards.json";

interface CardDim {
  id: string;
  label: string;
  sub: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  z: number;
  shadow: string;
  idx: number;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const NAV_ITEMS = ["Work", "Productions", "Process", "About", "Contact"];

export default function GalleryWall() {
  const wallRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  const cards: CardDim[] = useMemo(() => {
    const taken: { x: number; y: number }[] = [];
    return galleryCards.map((c, i) => {
      let x: number, y: number, attempts = 0;
      do {
        x = rand(2, 72);
        y = rand(4, 72);
        attempts++;
      } while (attempts < 50 && taken.some((p) => Math.abs(p.x - x) < 10 && Math.abs(p.y - y) < 10));
      taken.push({ x, y });
      return {
        id: c.id,
        label: c.label,
        sub: c.sub,
        x, y,
        w: c.width,
        h: c.height,
        rotation: rand(-5, 5),
        z: Math.floor(rand(1, 12)),
        shadow: `rgba(0,0,0,${rand(0.06, 0.16).toFixed(3)})`,
        idx: i,
      };
    });
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setHidden(true);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, []);

  const handleMouse = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
  }, []);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, [handleMouse]);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    let frame: number;

    const tick = () => {
      const sy = scrollRef.current;
      const vh = window.innerHeight;
      const p = Math.min(Math.max(sy / (vh * 0.45), 0), 1);
      setProgress(p);

      if (p >= 1) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Animate each card
      const els = wall.querySelectorAll<HTMLElement>("[data-card-id]");
      els.forEach((el) => {
        const cx = parseFloat(el.dataset.cx || "0");
        const cy = parseFloat(el.dataset.cy || "0");
        const crot = parseFloat(el.dataset.rot || "0");

        const dx = (mx - 0.5) * 6;
        const dy = (my - 0.5) * 6;

        const ex = (cx - 50) * p * 2.5;
        const ey = (cy - 50) * p * 2.5;
        const er = crot + (Math.random() > 0.5 ? 1 : -1) * p * 25;
        const s = 1 - p * 0.18;
        const o = 1 - p * 1.3;

        el.style.transform = `translate(calc(${cx}vw + ${dx}px + ${ex}vw), calc(${cy}vh + ${dy}px + ${ey}vh)) rotate(${er}deg) scale(${s})`;
        el.style.opacity = `${Math.max(0, o)}`;
      });

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (hidden) return null;

  const bgOpacity = 1 - progress;
  const contentOpacity = 1 - progress * 1.1;

  return (
    <div
      ref={wallRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        zIndex: 100,
        background: `linear-gradient(135deg, #F5F0E8 0%, #EDE8DF 50%, #F0EBE2 100%)`,
        opacity: bgOpacity,
        transition: "opacity 0.3s ease",
        pointerEvents: progress > 0.8 ? "none" : "auto",
      }}
    >
      {/* Subtle gallery texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Logo top-left */}
      <div
        className="absolute top-8 left-8 z-20"
        style={{ opacity: contentOpacity }}
      >
        <a href="#" className="no-underline">
          <span className="text-caption font-sans font-[500] text-stone-600 uppercase tracking-[0.2em]">
            Donayan Sahdev
          </span>
        </a>
      </div>

      {/* Nav top-right */}
      <nav
        className="absolute top-8 right-8 z-20 flex items-center gap-8"
        style={{ opacity: contentOpacity }}
      >
        {NAV_ITEMS.map((item) => {
          const href = item === "Productions" ? "#productions" :
            item === "Process" ? "#process" :
            `#${item.toLowerCase()}`;
          return (
            <a
              key={item}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="text-caption font-sans font-[500] text-stone-500 no-underline uppercase tracking-[0.2em] hover:text-stone-800 transition-colors duration-300 cursor-pointer"
            >
              {item}
            </a>
          );
        })}
      </nav>

      {/* Floating cards */}
      {cards.map((card) => (
        <div
          key={card.id}
          data-card-id={card.id}
          data-cx={card.x}
          data-cy={card.y}
          data-rot={card.rotation}
          className="absolute"
          style={{
            width: `${card.w}px`,
            height: `${card.h}px`,
            zIndex: card.z,
            transform: `translate(${card.x}vw, ${card.y}vh) rotate(${card.rotation}deg)`,
            willChange: "transform, opacity",
            pointerEvents: "none",
          }}
        >
          <div
            className="w-full h-full rounded-sm overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #FAFAF8 0%, #F0EFEA 100%)`,
              boxShadow: `0 2px 12px ${card.shadow}, 0 8px 40px ${card.shadow}, inset 0 0 0 1px rgba(255,255,255,0.8)`,
              transition: "box-shadow 0.4s ease",
            }}
          >
            <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-br from-stone-100/60 via-zinc-50/40 to-stone-200/40">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full border border-stone-300/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-stone-300/60" />
                </div>
                <p className="text-caption font-sans font-[500] text-stone-500 uppercase tracking-[0.15em] leading-[1.2]">
                  {card.label}
                </p>
                <p className="mt-1 text-[9px] font-sans font-[400] text-stone-400 tracking-[0.1em] uppercase">
                  {card.sub}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Center hero typography */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20"
        style={{ opacity: contentOpacity, pointerEvents: "none" }}
      >
        <div className="text-center max-w-2xl px-6">
          <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.25em] mb-4">
            Director&apos;s Assistant & Associate Producer
          </p>
          <h1 className="text-display md:text-hero lg:text-[100px] font-display font-[400] leading-[0.9] tracking-[-0.05em] text-stone-900 text-balance">
            DONAYAN
            <br />
            SAHDEV
          </h1>
          <p className="mt-4 text-body-sm font-sans font-[400] text-stone-500 uppercase tracking-[0.15em]">
            Commercial Advertising &middot; Fashion &middot; Celebrity Campaigns
          </p>
          <p className="mt-6 text-lead font-sans font-[300] text-stone-500 leading-[1.4] tracking-[0.02em] max-w-md mx-auto italic">
            &ldquo;Every frame begins long before the camera rolls.&rdquo;
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        style={{ opacity: Math.max(0, 1 - progress * 3) }}
      >
        <div className="scroll-indicator flex flex-col items-center gap-2">
          <span className="text-caption font-sans font-[400] text-stone-400 uppercase tracking-[0.25em]">
            Enter the Production Log
          </span>
          <svg width="18" height="26" viewBox="0 0 18 26" fill="none" className="text-stone-400">
            <rect x="1" y="1" width="16" height="24" rx="8" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9" cy="9" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
