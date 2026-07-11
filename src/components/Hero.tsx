"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-bone-white overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-8 md:px-10 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-center gap-16 md:gap-24">
          {/* Left: Typography */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-display font-switzer font-[300] text-ink-black leading-[1] tracking-[-0.04em] text-balance">
              Donayan
              <br />
              Sahdev
            </h1>

            <p className="mt-6 text-subheading font-switzer font-[300] text-graphite leading-[1.4] max-w-lg">
              Director&apos;s Assistant & Associate Producer — helping directors
              transform creative vision into flawlessly executed productions for
              India&apos;s biggest brands and agencies.
            </p>

            {/* Pill CTA — black fill, bone-white text, 1440px radius */}
            <div className="mt-10">
              <a
                href="#wall"
                className="inline-flex items-center gap-3 bg-ink-black text-bone-white font-switzer font-[400] no-underline tracking-[-0.01em]"
                style={{
                  fontSize: "16px",
                  padding: "12px 28px",
                  borderRadius: "1440px",
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                Explore Production Log
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-bone-white">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-10 md:gap-14 mt-14">
              <div>
                <p className="text-heading-sm font-switzer font-[300] text-ink-black leading-[1] tracking-[-0.02em]">60+</p>
                <p className="text-caption font-switzer font-[400] text-graphite mt-1">Commercial Productions</p>
              </div>
              <div>
                <p className="text-heading-sm font-switzer font-[300] text-ink-black leading-[1] tracking-[-0.02em]">28+</p>
                <p className="text-caption font-switzer font-[400] text-graphite mt-1">Brands</p>
              </div>
              <div>
                <p className="text-heading-sm font-switzer font-[300] text-ink-black leading-[1] tracking-[-0.02em]">Mumbai</p>
                <p className="text-caption font-switzer font-[400] text-graphite mt-1">India</p>
              </div>
            </div>
          </div>

          {/* Right: Full-bleed editorial photo */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-full max-w-[400px]">
              <img
                src="/hero-bg.jpg"
                alt="Donayan Sahdev on set"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: "3/4", display: "block" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-caption font-switzer font-[400] text-ash uppercase tracking-[0.05em]">Scroll</span>
        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" className="text-ash">
          <rect x="1" y="1" width="10" height="16" rx="5" stroke="currentColor" strokeWidth="1" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
