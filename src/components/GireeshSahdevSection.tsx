"use client";

import { useEffect, useRef, useState } from "react";

const instagramPosts = [
  {
    id: "g-1",
    thumbnail: null,
    url: "https://www.instagram.com/reel/C9Hady1yVDJ/",
    caption: "Music Video Production",
  },
  {
    id: "g-2",
    thumbnail: null,
    url: "https://www.instagram.com/p/C6BbgzXoyLR/",
    caption: "Tanishq Rivaah Campaign",
  },
  {
    id: "g-3",
    thumbnail: null,
    url: "https://www.instagram.com/reel/C7RB6gGoVDQ/",
    caption: "Sprite Heat Happens",
  },
  {
    id: "g-4",
    thumbnail: null,
    url: "https://www.instagram.com/p/Cz-2Mi0C6Bg/",
    caption: "Armani Exchange SS'25",
  },
];

export default function GireeshSahdevSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-cinema-black border-t border-cinema-white/8"
      aria-label="@gireesh_sahdev Instagram"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-10">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <p className="text-caption font-switzer font-[400] text-gold/60 uppercase tracking-[0.02em] mb-3">
            Collaboration
          </p>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-3">
            <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em]">
              @gireesh_sahdev
            </h2>
            <a
              href="https://www.instagram.com/gireesh_sahdev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-cinema-black text-caption font-switzer font-[400] uppercase tracking-[0.02em] no-underline transition-opacity hover:opacity-85"
              style={{ borderRadius: "1440px", width: "fit-content" }}
            >
              Follow
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0z" />
              </svg>
            </a>
          </div>
          <p className="text-body-sm font-switzer font-[300] text-stone leading-[1.6] max-w-xl mb-10">
            Featured collaborations and creative projects produced for <strong className="text-cinema-white/80 font-[400]">Gireesh Sahdev</strong> — director, creative producer, and visual storyteller.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {instagramPosts.map((post, i) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block no-underline"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease ${0.1 + i * 0.1}s, transform 0.6s ease ${0.1 + i * 0.1}s`,
              }}
            >
              <div
                className="relative aspect-square overflow-hidden"
                style={{
                  borderRadius: "12px",
                  background: "#141414",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.3)" stroke="none" />
                  </svg>
                  <span className="text-caption font-switzer font-[400] text-white/40 uppercase tracking-[0.02em] text-center px-2">
                    {post.caption}
                  </span>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)" }}
                >
                  <span className="text-caption font-switzer font-[400] text-white uppercase tracking-[0.02em] border border-white/30 px-4 py-2">
                    View Post
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
