"use client";

import { useState, useEffect, useCallback } from "react";

const navItems = [
  { label: "Wall", href: "#wall" },
  { label: "Archive", href: "#featured" },
  { label: "Timeline", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    );

    const sections = navItems.map((item) => document.getElementById(item.href.slice(1))).filter(Boolean);
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, href: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setMenuOpen(false);
        const id = href.slice(1);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    },
    []
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cinema-black/80 backdrop-blur-xl border-b border-cinema-white/5"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-10 flex items-center justify-between h-20 md:h-24">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-transparent border-none p-0 cursor-pointer no-underline focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cinema-black rounded-lg"
          aria-label="Donayan Sahdev — Scroll to top"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-cinema-white" aria-hidden="true">
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="5" fill="currentColor" />
          </svg>
        </button>

        <div className="hidden md:flex items-center gap-8" role="list">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-body-sm font-switzer font-[400] no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cinema-black rounded-sm ${
                activeSection === item.href
                  ? "text-cinema-white"
                  : "text-cinema-white/60 hover:text-cinema-white"
              }`}
              role="listitem"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setMenuOpen(!menuOpen); } }}
          className="bg-gold text-cinema-black font-switzer font-[400] no-underline border-none cursor-pointer transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cinema-black"
          style={{ fontSize: "16px", padding: "12px 24px", borderRadius: "1440px" }}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-cinema-black flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col items-center gap-10" role="list">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-heading font-switzer font-[300] no-underline tracking-[-0.02em] focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-cinema-black rounded-sm ${
                  activeSection === item.href
                    ? "text-gold"
                    : "text-cinema-white hover:text-gold"
                }`}
                onClick={() => setMenuOpen(false)}
                onKeyDown={(e) => handleKeyDown(e, item.href)}
                role="listitem"
                tabIndex={0}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
