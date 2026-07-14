"use client";

const EMAIL = "email-ads.dani@gmail.com";
const WHATSAPP_HREF = "https://wa.me/919819317834";
const INSTAGRAM = "https://www.instagram.com/donayansahdev/";
const LINKEDIN = "https://www.linkedin.com/in/donayan";
const INQUIRY = "https://docs.google.com/forms/d/e/1FAIpQLSdXeb-btHivYM9OJiNbev68zrPD868AcDY3dArmLIgMOpfoxw/viewform";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-cinema-white/5 bg-cinema-black py-10 md:py-14" role="contentinfo">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="font-switzer text-heading-sm font-[300] leading-[1] tracking-[-0.02em] text-cinema-white">
              Donayan Sahdev
            </p>
            <p className="mt-2 font-switzer text-body-sm font-[400] text-cinema-white/40">
              Creative Producer &middot; Director &middot; Production
            </p>
          </div>

          {/* Contact links */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-switzer text-body-sm font-[400]">
            <a
              href={`mailto:${EMAIL}`}
              className="no-underline text-cinema-white/70 transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black rounded-sm"
              aria-label={`Email ${EMAIL}`}
            >
              Email
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-cinema-white/70 transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black rounded-sm"
              aria-label="WhatsApp +91 9819317834"
            >
              WhatsApp
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-cinema-white/70 transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black rounded-sm"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-cinema-white/70 transition-colors hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black rounded-sm"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>

          {/* Project inquiry */}
          <a
            href={INQUIRY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 font-switzer text-body-sm font-[400] uppercase tracking-[0.03em] text-cinema-black no-underline transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black"
            aria-label="Start a project inquiry"
          >
            Project Inquiry
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-cinema-white/5 pt-6 text-caption font-switzer font-[400] text-cinema-white/20 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} Donayan Sahdev. All Rights Reserved.</p>
          <p>Mumbai, India</p>
        </div>
      </div>
    </footer>
  );
}
