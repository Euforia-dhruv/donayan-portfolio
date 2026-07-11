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
          scrolled ? "bg-cinema-black/80 backdrop-blur-xl border-b border-cinema-white/5" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-10 flex items-center justify-between h-20 md:h-24">
          <a href="#" className="no-underline">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-cinema-white">
              <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="5" fill="currentColor" />
            </svg>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-body-sm font-switzer font-[400] text-cinema-white/60 no-underline hover:text-cinema-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-gold text-cinema-black font-switzer font-[400] no-underline border-none cursor-pointer transition-opacity hover:opacity-85"
            style={{ fontSize: "16px", padding: "12px 24px", borderRadius: "1440px" }}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-cinema-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-heading font-switzer font-[300] text-cinema-white no-underline tracking-[-0.02em]"
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
