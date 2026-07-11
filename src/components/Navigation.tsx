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
            ? "bg-cream-paper/80 backdrop-blur-[9px] border-b border-charcoal/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 flex items-center justify-between h-20 md:h-24">
          <a
            href="#"
            className="font-geist font-[500] text-charcoal no-underline"
            style={{ fontSize: "15px", letterSpacing: "0" }}
          >
            Donayan Sahdev
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-geist font-[400] text-charcoal/60 no-underline hover:text-charcoal transition-colors"
                style={{ fontSize: "15px", letterSpacing: "0" }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden font-geist font-[500] text-charcoal no-underline bg-transparent border border-charcoal/30 px-4 py-2 cursor-pointer hover:border-charcoal/60 transition-colors"
            style={{ fontSize: "14px", letterSpacing: "0", borderRadius: "20px" }}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-cream-paper flex items-center justify-center">
          <div className="flex flex-col items-center gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-gelica font-[500] text-cocoa-ink no-underline"
                style={{ fontSize: "36px", letterSpacing: "0" }}
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
