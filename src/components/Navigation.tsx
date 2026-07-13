"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const navItems = [
  { label: "Wall", href: "#wall" },
  { label: "Archive", href: "#featured" },
  { label: "Timeline", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const lastScrollY = useRef(0);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 60);
      if (menuOpenRef.current) {
        setHidden(false);
        return;
      }
      if (sy > 200) {
        setHidden(sy > lastScrollY.current);
      } else {
        setHidden(false);
      }
      lastScrollY.current = sy;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
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
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" },
    );
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter(Boolean);
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
    [],
  );

  const linkClass = (active: boolean) =>
    `relative font-switzer text-body-sm font-[400] no-underline transition-colors after:absolute after:bottom-[-6px] after:left-0 after:h-px after:w-full after:rounded-full after:bg-gold after:content-[''] after:transition-transform after:duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black ${
      active
        ? "text-cinema-white after:scale-x-100"
        : "text-cinema-white/50 after:scale-x-0 hover:text-cinema-white"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled || menuOpen
          ? "bg-cinema-black/80 backdrop-blur-xl border-b border-cinema-white/5"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-8 md:h-24 md:px-10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="shrink-0 cursor-pointer border-none bg-transparent p-0 text-cinema-white outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black rounded-lg"
          aria-label="Donayan Sahdev — Scroll to top"
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-cinema-white" aria-hidden="true">
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="5" fill="currentColor" />
          </svg>
        </button>

        <div className="flex items-center gap-10" role="list">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`${linkClass(activeSection === item.href)} hidden md:inline`}
              role="listitem"
            >
              {item.label}
            </a>
          ))}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMenuOpen(!menuOpen);
              }
            }}
            className="cursor-pointer border-none bg-gold font-switzer text-cinema-black transition-all hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black"
            style={{ fontSize: "14px", padding: "10px 22px", borderRadius: "1440px", letterSpacing: "0.03em" }}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-40 flex items-center justify-center bg-cinema-black transition-all duration-300 ${
          menuOpen
            ? "pointer-events-auto opacity-100 scale-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-10" role="list">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              onKeyDown={(e) => handleKeyDown(e, item.href)}
              role="listitem"
              tabIndex={menuOpen ? 0 : -1}
              className={`text-[clamp(36px,6vw,64px)] font-switzer font-[300] no-underline tracking-[-0.02em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black rounded-sm ${
                activeSection === item.href
                  ? "text-gold"
                  : "text-cinema-white hover:text-gold"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
