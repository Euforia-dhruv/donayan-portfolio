"use client";

import { useSettings } from "@/lib/convex/site-data";

export default function Footer() {
  const { settings } = useSettings();
  const instagram = settings?.instagram || "https://www.instagram.com/donayan_";
  const linkedin = settings?.linkedin || "https://linkedin.com/in/donayansahdev";

  return (
    <footer className="bg-cinema-black border-t border-cinema-white/5 py-8 md:py-10" role="contentinfo">
      <div className="max-w-[1400px] mx-auto px-8 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h3 className="text-heading-sm font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.02em]">
              Donayan Sahdev
            </h3>
            <p className="mt-2 text-body-sm font-switzer font-[400] text-cinema-white/40">
              Production &middot; Commercials &middot; Brand Films &middot; Music Videos
            </p>
          </div>

          <div className="flex gap-6 text-body-sm font-switzer font-[400] text-cinema-white/40 uppercase tracking-[0.02em]">
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-gold transition-colors" aria-label="Instagram">Instagram</a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-gold transition-colors" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cinema-white/5 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-caption font-switzer font-[400] text-cinema-white/20">
            &copy; 2026 Donayan Sahdev. All rights reserved.
          </p>
          <p className="text-caption font-switzer font-[400] text-cinema-white/20">
            Mumbai, India
          </p>
        </div>
      </div>
    </footer>
  );
}
