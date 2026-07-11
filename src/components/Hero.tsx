"use client";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-cream-paper"
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 pt-28 pb-16">
        <div className="flex flex-col md:flex-row md:items-center gap-12 md:gap-16">
          {/* Left: Typography */}
          <div className="flex-1 max-w-xl">
            <div className="space-y-2">
              <h1 className="font-gelica font-[600] text-cocoa-ink leading-[1.08] lowercase text-balance"
                style={{ fontSize: "clamp(56px, 12vw, 104px)" }}>
                donayan
                <br />
                sahdev
              </h1>
            </div>

            <p className="mt-6 font-gelica font-[400] text-charcoal/70 leading-[1.5]"
              style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
              Director&apos;s Assistant & Associate Producer — helping directors
              transform creative vision into flawlessly executed productions for
              India&apos;s biggest brands and agencies.
            </p>

            {/* Pill Action Button */}
            <div className="mt-10">
              <a
                href="#wall"
                className="inline-flex items-center gap-3 font-geist font-[500] text-charcoal no-underline"
                style={{
                  fontSize: "16px",
                  letterSpacing: "0",
                  border: "1.5px solid #171717",
                  padding: "10px 28px",
                  borderRadius: "20px",
                  background: "#fdfbf9",
                  boxShadow: "rgba(0,0,0,0.25) 0px 1px 2px 0px",
                  transition: "box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "rgba(0,0,0,0.35) 0px 2px 6px 0px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "rgba(0,0,0,0.25) 0px 1px 2px 0px";
                }}
              >
                Explore Production Log
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-charcoal">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Stats row */}
            <div className="flex gap-10 md:gap-14 mt-14">
              <div>
                <p className="font-gelica font-[500] text-cocoa-ink leading-[1]" style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}>60+</p>
                <p className="font-geist font-[400] text-charcoal/50 mt-1" style={{ fontSize: "14px" }}>Commercial Productions</p>
              </div>
              <div>
                <p className="font-gelica font-[500] text-cocoa-ink leading-[1]" style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}>28+</p>
                <p className="font-geist font-[400] text-charcoal/50 mt-1" style={{ fontSize: "14px" }}>Brands</p>
              </div>
              <div>
                <p className="font-gelica font-[500] text-cocoa-ink leading-[1]" style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}>Mumbai</p>
                <p className="font-geist font-[400] text-charcoal/50 mt-1" style={{ fontSize: "14px" }}>India</p>
              </div>
            </div>
          </div>

          {/* Right: Photo — tilted notebook-style */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div
              className="relative overflow-hidden"
              style={{
                transform: "rotate(4deg)",
                borderRadius: "16px",
                boxShadow: "rgba(0,0,0,0.06) 0px 2px 20px 0px",
                maxWidth: "400px",
                width: "100%",
              }}
            >
              <img
                src="/hero-bg.jpg"
                alt="Donayan Sahdev on set"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: "3/4", display: "block" }}
              />
              {/* Thin charcoal border */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ border: "1px solid rgba(23,23,23,0.15)", borderRadius: "16px" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-geist font-[400] text-charcoal/20" style={{ fontSize: "12px", letterSpacing: "0.05em" }}>
          scroll
        </span>
        <svg width="12" height="18" viewBox="0 0 12 18" fill="none" className="text-charcoal/15">
          <rect x="1" y="1" width="10" height="16" rx="5" stroke="currentColor" strokeWidth="1" />
          <circle cx="6" cy="6" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
