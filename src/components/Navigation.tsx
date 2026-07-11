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
          scrolled
            ? "bg-cinema-black/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-20 md:h-24">
          <a
            href="#"
            className="text-body-sm font-sans font-[500] text-cinema-white no-underline tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            Donayan Sahdev
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-caption font-sans font-[500] text-cinema-white/60 no-underline uppercase tracking-[0.15em] hover:text-cinema-white transition-all duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-caption font-sans font-[500] text-cinema-white uppercase tracking-[0.15em] bg-transparent border border-white/20 px-4 py-2 rounded cursor-pointer hover:bg-white/5 transition-colors"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-cinema-black/95 backdrop-blur-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-heading-sm font-sans font-[300] text-cinema-white no-underline tracking-[0.1em] uppercase hover:text-champagne transition-colors"
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
