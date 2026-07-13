"use client";

import pdfs from "@/lib/pdf-manifest.json";

function FallbackCover({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-charcoal to-black p-4 text-center">
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-cinema-white/70" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      </svg>
      <p className="font-switzer text-caption uppercase tracking-[0.02em] text-stone">{name}</p>
    </div>
  );
}

export default function PdfGallery() {
  return (
    <section
      className="relative w-full bg-cinema-black"
      style={{ padding: "clamp(40px, 6vw, 80px) 0" }}
      aria-label="Documents and Press Kits"
    >
      <div className="mx-auto max-w-[1500px] px-8 md:px-10">
        <div className="mb-12 text-center md:mb-16">
          <p className="font-switzer text-caption font-[400] uppercase tracking-[0.02em] text-stone">
            Documents
          </p>
          <h2
            className="mt-3 font-switzer font-[300] leading-[1] tracking-[-0.03em]"
            style={{ fontSize: "clamp(32px, 4vw, 54px)", color: "#F5F5F2" }}
          >
            Press & Pitch Decks
          </h2>
          <p className="mt-2 font-switzer text-caption font-[400] text-stone/60">
            {pdfs.length} files
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {pdfs.map((d) => (
            <a
              key={d.pdf}
              href={encodeURI(d.pdf)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl bg-charcoal outline-none transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-gold"
              style={{
                aspectRatio: "3 / 4",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              }}
              aria-label={`${d.name} — open PDF`}
            >
              {d.cover ? (
                <img
                  src={encodeURI(d.cover)}
                  alt={d.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <FallbackCover name={d.name} />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                <p className="font-switzer text-body-sm leading-tight text-cinema-white">
                  {d.name}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
