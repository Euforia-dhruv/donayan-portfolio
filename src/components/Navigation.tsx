"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Section-based navigation for a single-page scroll portfolio.
 *
 *  • Fixed at top, transparent over the hero, blurs to a dark bar on scroll.
 *  • Every item scrolls smoothly to its in-page section (Wall / Archive /
 *    Timeline / About / Contact), accounting for the fixed navbar height.
 *  • Active section is tracked with an IntersectionObserver scroll-spy and
 *    highlighted with an animated underline (desktop) / gold text (mobile).
 *  • Logo returns to the top of the page.
 *  • On standalone sub-pages the same labels route to `/#section` and the
 *    homepage then scrolls to the anchored section on arrival.
 */

const SECTIONS = [
  { id: "wall", label: "Wall" },
  { id: "archive", label: "Archive" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

const CTA = { label: "Let's connect" };

// Every "Start a Project" / inquiry entry point connects straight to the form.
const INQUIRY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdXeb-btHivYM9OJiNbev68zrPD868AcDY3dArmLIgMOpfoxw/viewform?usp=header";

const NAV_H = 80; // h-20 — also read live from the <nav> element

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const [overOutro, setOverOutro] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  const isHome = pathname === "/";

  // Offset used for both smooth scrolling and the scroll-spy band.
  const offset = () => (navRef.current?.offsetHeight ?? NAV_H) + 8;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the menu on Escape and whenever the route changes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // --- Scroll-spy: highlight the section currently under the navbar --------
  useEffect(() => {
    if (!isHome) return;
    const visible = new Set<string>();
    const ids = SECTIONS.map((s) => s.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (els.length === 0) return;

    const compute = () => {
      let best: string | null = null;
      let bestTop = Infinity;
      visible.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top < bestTop) {
          bestTop = top;
          best = id;
        }
      });
      if (best) setActiveId(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        compute();
      },
      { rootMargin: `-${NAV_H}px 0px -45% 0px`, threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    compute();
    return () => observer.disconnect();
  }, [isHome, pathname]);

  // --- On arrival at `/#section` (direct load or cross-page nav) scroll ----
  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash || !SECTIONS.some((s) => s.id === hash)) return;
    const id = window.requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({ top: y, behavior: "auto" });
      setActiveId(hash);
    });
    return () => window.cancelAnimationFrame(id);
  }, [isHome, pathname]);

  // Smoothly scroll to a section (homepage only — the default Link behaviour
  // handles cross-page navigation to `/#section`).
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - offset();
    window.scrollTo({ top: y, behavior: "smooth" });
    window.history.pushState(null, "", `#${id}`);
    setActiveId(id);
  };

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    if (isHome) {
      e.preventDefault();
      scrollToSection(id);
      setMenuOpen(false);
    }
    // Not on the homepage: let <Link> navigate to `/#id`; the effect above
    // will scroll once the homepage mounts.
  };

  const handleLogo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
      setMenuOpen(false);
    }
  };

  const activeFor = (id: string) =>
    isHome ? activeId === id : pathname === `/${id}`;

  // When the cinematic ending enters under the navbar, go transparent so
  // the portrait shows through (its top is a near-black gradient).
  useEffect(() => {
    const el = document.getElementById("contact-outro");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setOverOutro(e.isIntersecting),
      { rootMargin: `-${NAV_H}px 0px 0px`, threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pathname]);

  const solid = (scrolled && !overOutro) || menuOpen || !isHome;

  const linkClass = (active: boolean) =>
    `relative font-switzer text-body-sm font-[400] no-underline transition-colors after:absolute after:bottom-[-6px] after:left-0 after:h-px after:w-full after:rounded-full after:bg-gold after:content-[''] after:transition-transform after:duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black ${
      active
        ? "text-cinema-white after:scale-x-100"
        : "text-cinema-white/55 after:scale-x-0 hover:text-cinema-white"
    }`;

  return (
    <nav
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500 ${
        solid
          ? "border-b border-cinema-white/5 bg-cinema-black/85 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleLogo}
          aria-label="Donayan Sahdev — Home"
          className="flex shrink-0 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black"
        >
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" className="text-cinema-white" aria-hidden="true">
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="5" fill="currentColor" />
          </svg>
          <span className="ml-3 font-switzer text-body font-[400] tracking-[-0.01em] text-cinema-white">
            Donayan
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden flex-1 items-center justify-center gap-10 md:flex">
          {SECTIONS.map((item) => (
            <Link
              key={item.id}
              href={isHome ? `#${item.id}` : `/#${item.id}`}
              onClick={(e) => handleNav(e, item.id)}
              aria-current={activeFor(item.id) ? "true" : undefined}
              className={linkClass(activeFor(item.id))}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-4">
          <a
            href={INQUIRY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="Start Project"
            data-contact="1"
            className="hidden rounded-full bg-gold px-6 py-2.5 font-switzer text-body-sm font-[400] uppercase tracking-[0.03em] text-cinema-black no-underline transition-opacity duration-300 hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black md:inline-flex"
          >
            {CTA.label}
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black md:hidden"
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-cinema-white transition-all duration-300 ${
                  menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-px w-6 -translate-y-1/2 bg-cinema-white transition-all duration-300 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-cinema-white transition-all duration-300 ${
                  menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-0 z-40 flex flex-col bg-cinema-black/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 5rem)" }}
      >
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Mobile">
          {SECTIONS.map((item) => (
            <Link
              key={item.id}
              href={isHome ? `#${item.id}` : `/#${item.id}`}
              onClick={(e) => handleNav(e, item.id)}
              aria-current={activeFor(item.id) ? "true" : undefined}
              tabIndex={menuOpen ? 0 : -1}
              className={`flex min-h-[44px] items-center border-b border-cinema-white/5 font-switzer text-[clamp(28px,8vw,44px)] font-[300] tracking-[-0.02em] no-underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black ${
                activeFor(item.id) ? "text-gold" : "text-cinema-white hover:text-gold"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={INQUIRY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="Start Project"
            data-contact="1"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-gold px-8 py-3 font-switzer text-body-sm font-[400] uppercase tracking-[0.03em] text-cinema-black no-underline transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black"
          >
            {CTA.label}
          </a>
        </nav>
      </div>
    </nav>
  );
}
