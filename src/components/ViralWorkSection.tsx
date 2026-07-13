"use client";

import { useEffect, useRef, useState } from "react";

const viralCampaigns = [
  {
    id: "viral-1",
    brand: "Lakmé India",
    year: "2023",
    role: "Director's Assistant",
    description: "12-shoot DIY campaign — one of Lakmé's most-viewed social campaigns with million+ reach across platforms.",
    platform: "Instagram Reels",
    thumbnail: null,
    url: "https://www.instagram.com/reel/C-MkhP6ykXP/",
  },
  {
    id: "viral-2",
    brand: "Sprite",
    year: "2024",
    role: "Director's Assistant",
    description: "'Heat Happens' campaign — high-engagement commercial driving significant brand conversation during summer season.",
    platform: "Instagram Reel",
    thumbnail: null,
    url: "https://www.instagram.com/reel/C7RB6gGoVDQ/",
  },
  {
    id: "viral-3",
    brand: "Tanishq",
    year: "2024",
    role: "Director's Assistant",
    description: "Rivaah bridal collection featuring Nayanthara — celebrity-driven campaign with massive social traction.",
    platform: "Instagram Campaign",
    thumbnail: null,
    url: "https://www.instagram.com/p/C6BbgzXoyLR/",
  },
  {
    id: "viral-4",
    brand: "Dove",
    year: "2024",
    role: "Director's Assistant",
    description: "'Stop Beauty Test' — empowering social campaign that sparked meaningful conversation across platforms.",
    platform: "Instagram Reel",
    thumbnail: null,
    url: "https://www.instagram.com/reel/C4h8FkuN7Li/",
  },
];

export default function ViralWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-cinema-black border-t border-cinema-white/8"
      aria-label="Viral Campaigns"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-10">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <p className="text-caption font-switzer font-[400] text-gold/60 uppercase tracking-[0.02em] mb-3">
            Social Impact
          </p>
          <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] max-w-2xl mb-6">
            Viral Campaigns
          </h2>
          <p className="text-body-sm font-switzer font-[300] text-stone leading-[1.6] max-w-xl mb-10">
            Donayan&apos;s highest-performing social campaigns — content that drove engagement, conversation, and brand impact across platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {viralCampaigns.map((campaign, i) => (
            <a
              key={campaign.id}
              href={campaign.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block no-underline"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease ${0.1 + i * 0.1}s, transform 0.6s ease ${0.1 + i * 0.1}s`,
              }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "#141414",
                  transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-caption font-switzer font-[400] text-gold/60 uppercase tracking-[0.02em]">
                        {campaign.year}
                      </p>
                      <h3 className="text-subheading md:text-heading-sm font-switzer font-[300] text-cinema-white leading-[1.1] mt-1 group-hover:text-gold transition-colors duration-300">
                        {campaign.brand}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-caption font-switzer font-[400] text-cinema-white/40 uppercase tracking-[0.02em] border border-cinema-white/10 px-3 py-1">
                        {campaign.platform}
                      </span>
                    </div>
                  </div>
                  <p className="text-body-sm font-switzer font-[300] text-stone leading-[1.6]">
                    {campaign.description}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-caption font-switzer font-[400] text-cinema-white/50 uppercase tracking-[0.02em]">
                      {campaign.role}
                    </span>
                    <span className="text-cinema-white/20" aria-hidden="true">·</span>
                    <span className="text-caption font-switzer font-[400] text-gold/60 uppercase tracking-[0.02em] inline-flex items-center gap-1">
                      View Campaign
                      <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
