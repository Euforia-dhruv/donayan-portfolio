"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const FORM = "https://docs.google.com/forms/d/e/1FAIpQLSdXeb-btHivYM9OJiNbev68zrPD868AcDY3dArmLIgMOpfoxw/viewform?usp=header";
const TEL = "tel:+919819317834";
const EMAIL = "mailto:ads.donayan@gmail.com";
const INSTAGRAM = "https://www.instagram.com/donayansahdev/";
const LINKEDIN = "https://www.linkedin.com/in/donayan?utm_source=share_via&utm_content=profile&utm_medium=member_android";

const DISMISS_KEY = "wwm-dismissed-at";
const SESSION_KEY = "wwm-shown-session";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export default function WorkWithMePopup() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  // Auto triggers: 25s OR 60% scroll (once per session, unless suppressed 7d).
  useEffect(() => {
    const isAdmin =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin");
    if (isAdmin) return;

    let dismissed = false;
    try {
      const ts = Number(localStorage.getItem(DISMISS_KEY) || 0);
      dismissed = ts > 0 && Date.now() - ts < SEVEN_DAYS;
    } catch {
      /* ignore */
    }

    let triggered = false;
    const maybe = () => {
      try {
        if (sessionStorage.getItem(SESSION_KEY)) return;
      } catch {
        /* ignore */
      }
      if (triggered) return;
      triggered = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    };

    const timer = dismissed ? null : setTimeout(maybe, 25000);

    const onScroll = () => {
      const el = document.documentElement;
      const h = el.scrollHeight - window.innerHeight;
      if (h > 0 && window.scrollY / h >= 0.6) maybe();
    };

    const onTrigger = () => setOpen(true);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("work-with-me", onTrigger);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("work-with-me", onTrigger);
    };
  }, []);

  // Lock scroll + Escape while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const cardMotion = reduce
    ? { initial: false as const }
    : {
        initial: { opacity: 0, scale: 0.96, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 12 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Work with me"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            {...cardMotion}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl border border-gold/20 bg-cinema-black/80 p-7 sm:p-9 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cinema-white/70 transition-colors hover:bg-white/10 hover:text-cinema-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>

            <p className="font-switzer text-caption font-[400] uppercase tracking-[0.12em] text-gold/70">
              Work With Me
            </p>
            <h2 className="mt-3 font-switzer font-[300] leading-[1.05] tracking-[-0.02em] text-cinema-white" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
              Let&apos;s Create Something Great
            </h2>
            <p className="mt-3 font-switzer text-body-sm font-[300] leading-[1.6] text-stone">
              Available for Commercials, Brand Films, Music Videos, Fashion and Creative
              Production.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={FORM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-switzer text-body-sm font-[400] uppercase tracking-[0.03em] text-cinema-black no-underline transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black sm:w-auto"
              >
                Open Inquiry Form
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={TEL}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 px-7 py-3.5 font-switzer text-body-sm font-[400] uppercase tracking-[0.03em] text-gold no-underline transition-colors hover:bg-gold/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black sm:w-auto"
              >
                Call Now
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5">
              <a href={EMAIL} className="font-switzer text-body-sm font-[400] text-cinema-white/70 no-underline transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                Email
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="font-switzer text-body-sm font-[400] text-cinema-white/70 no-underline transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                Instagram
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="font-switzer text-body-sm font-[400] text-cinema-white/70 no-underline transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                LinkedIn
              </a>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={close}
                className="font-switzer text-caption font-[400] text-stone/70 no-underline underline-offset-4 transition-colors hover:text-cinema-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              >
                Maybe Later
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="font-switzer text-caption font-[400] text-gold/80 no-underline underline-offset-4 transition-colors hover:text-gold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              >
                Don&apos;t show again for 7 days
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
