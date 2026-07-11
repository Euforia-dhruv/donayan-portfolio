"use client";

export default function Hero() {
  return (
    <section className="relative h-screen bg-[#F7F4EE] overflow-hidden">
      <div className="flex h-full max-w-[1440px] mx-auto px-10 lg:px-14">
        {/* Left: 45% */}
        <div className="w-[45%] flex items-center">
          <div className="w-full max-w-[520px] pt-[120px] pb-20">
            {/* Label */}
            <p
              className="font-switzer font-[400] text-[#666666] uppercase tracking-[0.08em] mb-8"
              style={{ fontSize: "11px", opacity: 0, animation: "heroFade 0.8s ease 0.1s forwards", transform: "translateY(12px)" }}
            >
              Director&apos;s Assistant & Associate Producer
            </p>

            {/* Name */}
            <h1
              className="font-switzer font-[500] text-[#000000] leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: "clamp(60px, 6.5vw, 100px)", opacity: 0, animation: "heroFade 0.8s ease 0.2s forwards", transform: "translateY(12px)" }}
            >
              Donayan
              <br />
              Sahdev
            </h1>

            {/* Specialization */}
            <p
              className="font-switzer font-[300] text-[#666666] mt-6 leading-[1.4]"
              style={{ fontSize: "clamp(15px, 1.15vw, 18px)", opacity: 0, animation: "heroFade 0.8s ease 0.3s forwards", transform: "translateY(12px)" }}
            >
              Commercial Advertising · Fashion · Celebrity Campaigns · Music Videos
            </p>

            {/* Paragraph */}
            <p
              className="font-switzer font-[300] text-[#666666] mt-4 leading-[1.6] max-w-[440px]"
              style={{ fontSize: "clamp(13px, 0.95vw, 15px)", opacity: 0, animation: "heroFade 0.8s ease 0.35s forwards", transform: "translateY(12px)" }}
            >
              Helping directors transform creative vision into flawlessly executed productions across India&apos;s biggest brands and agencies.
            </p>

            {/* CTA */}
            <div style={{ opacity: 0, animation: "heroFade 0.8s ease 0.45s forwards", transform: "translateY(12px)" }}>
              <a
                href="#wall"
                className="inline-flex items-center gap-3 bg-[#000000] text-[#F7F4EE] font-switzer font-[400] no-underline"
                style={{
                  fontSize: "13px",
                  height: "52px",
                  padding: "0 32px",
                  borderRadius: "8px",
                  letterSpacing: "0.02em",
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Explore Production Log
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#F7F4EE]">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {/* Stats */}
            <div
              className="flex gap-12 md:gap-16 mt-14"
              style={{ opacity: 0, animation: "heroFade 0.8s ease 0.55s forwards", transform: "translateY(12px)" }}
            >
              <div>
                <p className="font-switzer font-[500] text-[#000000] leading-[1]" style={{ fontSize: "clamp(22px, 2vw, 28px)" }}>60+</p>
                <p className="font-switzer font-[400] text-[#666666] mt-2" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>Commercial Productions</p>
              </div>
              <div>
                <p className="font-switzer font-[500] text-[#000000] leading-[1]" style={{ fontSize: "clamp(22px, 2vw, 28px)" }}>28+</p>
                <p className="font-switzer font-[400] text-[#666666] mt-2" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>Brands</p>
              </div>
              <div>
                <p className="font-switzer font-[500] text-[#000000] leading-[1]" style={{ fontSize: "clamp(22px, 2vw, 28px)" }}>Mumbai</p>
                <p className="font-switzer font-[400] text-[#666666] mt-2" style={{ fontSize: "11px", letterSpacing: "0.04em" }}>India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 55% — image dominant */}
        <div className="w-[55%] flex items-center justify-end pl-4">
          <div
            className="relative overflow-hidden"
            style={{
              height: "85vh",
              width: "auto",
              aspectRatio: "3/4",
              borderRadius: "14px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="/hero-bg.jpg"
              alt="Donayan Sahdev on set"
              className="h-full w-auto object-cover"
              style={{
                filter: "brightness(0.85) contrast(1.1) saturate(0.95)",
              }}
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0, animation: "heroFade 0.8s ease 0.7s forwards" }}
      >
        <span className="font-switzer font-[400] text-[#aaaaaa] uppercase" style={{ fontSize: "9px", letterSpacing: "0.08em" }}>Scroll</span>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="text-[#aaaaaa]">
          <rect x="1" y="1" width="8" height="14" rx="4" stroke="currentColor" strokeWidth="1" />
          <circle cx="5" cy="5.5" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
