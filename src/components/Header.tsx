"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import siteContent from "@/data/site-content.json";

const navItems = siteContent.nav;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[1200px] px-4">
      <nav
        className={cn(
          "flex items-center justify-between mx-auto px-5 py-2.5",
          "bg-paper/80 backdrop-blur-[9px] border border-mist rounded-[50px] shadow-sm"
        )}
      >
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-ink-black">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1" />
            <path d="M5 10h10M10 5v10" stroke="currentColor" strokeWidth="1" />
            <circle cx="10" cy="10" r="3" fill="currentColor" />
          </svg>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-body-sm font-af font-[500] text-charcoal no-underline hover:text-ink-black transition-colors tracking-[-0.01em]"
            >
              {item.label}
            </a>
          ))}
          <a
            href={siteContent.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm font-af font-[500] text-charcoal no-underline hover:text-ink-black transition-colors tracking-[-0.01em]"
          >
            Instagram
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-signal-blue text-signal-blue text-body-sm font-af font-[500] no-underline rounded-lg hover:bg-signal-blue/5 transition-colors tracking-[-0.01em]"
          >
            Get in Touch
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
              <path d="M5 4l2 2-2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden px-3 py-1.5 bg-transparent border border-twilight text-twilight text-body-sm font-af font-[500] rounded-lg cursor-pointer tracking-[-0.01em]"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden mt-2 bg-paper border border-mist rounded-xl shadow-subtle">
          <div className="flex flex-col px-5 py-6 gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-heading-sm font-ppmondwest font-[400] text-graphite no-underline"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={siteContent.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-heading-sm font-ppmondwest font-[400] text-graphite no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Instagram
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-signal-blue text-signal-blue text-body-sm font-af font-[500] no-underline rounded-lg w-fit"
              onClick={() => setMenuOpen(false)}
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
