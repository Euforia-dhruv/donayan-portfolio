"use client";

import { useState, useEffect } from "react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Wall", href: "#wall" },
    { label: "Archive", href: "#featured" },
    { label: "Timeline", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-bone-white/80 backdrop-blur-[9px] border-b border-ash/30" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-10 flex items-center justify-between h-20 md:h-24">
          {/* Logo mark — 32px circle */}
          <a href="#" className="no-underline">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-ink-black">
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="5" fill="currentColor" />
            </svg>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-body-sm font-switzer font-[400] text-ink-black no-underline hover:text-graphite transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Menu pill button — black fill, bone-white text, 1440px */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-ink-black text-bone-white font-switzer font-[400] no-underline border-none cursor-pointer transition-opacity hover:opacity-85"
            style={{
              fontSize: "16px",
              padding: "12px 24px",
              borderRadius: "1440px",
            }}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-bone-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-heading font-switzer font-[300] text-ink-black no-underline tracking-[-0.02em]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
