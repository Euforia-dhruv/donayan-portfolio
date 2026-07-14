"use client";

import { useRef, useEffect } from "react";
import { getMediaUrl } from "@/lib/media";
import { useAbout, useSettings } from "@/lib/convex/site-data";

const DEFAULT_BIO = `Donayan Sahdev is a Creative Producer and Director with experience producing commercials, brand films, fashion campaigns, music videos and digital-first content for leading brands and agencies. Passionate about cinematic storytelling, production excellence and building memorable visual experiences across platforms, he partners with agencies and brands to take projects from brief to final delivery. Based in Mumbai, India, Donayan works across the country and worldwide on commercials, brand films, fashion films, photography, creative direction and full-scale production.`;

export default function AboutSection({
  titleAs = "h2",
}: {
  titleAs?: "h1" | "h2";
}) {
  const { about } = useAbout();
  const { settings } = useSettings();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  const title =
    settings?.seoTitle ||
    settings?.siteTitle ||
    "Creative Producer & Director crafting cinematic brand stories.";
  const bio = about?.bio?.trim() || DEFAULT_BIO;
  const paragraphs = bio.split("\n\n").filter(Boolean);

  const stats = [
    { value: "60+", label: "Commercial Productions" },
    { value: "28+", label: "Brands" },
    { value: "5+", label: "Years in Production" },
    { value: "Mumbai", label: "India" },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-20 overflow-hidden reveal bg-cinema-black border-t border-cinema-white/8">
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-3">
            <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-4 reveal reveal-delay-1">About</p>
            {titleAs === "h1" ? (
              <h1 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] max-w-2xl mb-8 reveal reveal-delay-2">
                {title}
              </h1>
            ) : (
              <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] max-w-2xl mb-8 reveal reveal-delay-2">
                {title}
              </h2>
            )}
            <div className="space-y-4 reveal reveal-delay-3">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-body md:text-subheading font-switzer font-[300] text-stone leading-[1.6] max-w-2xl tracking-[-0.01em]">{para}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-start">
            <div className="relative aspect-[4/3] overflow-hidden mb-8 reveal reveal-delay-4">
              <img src={getMediaUrl("/hero-bg.jpg")} alt="On set production" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-caption font-switzer font-[400] text-cinema-white/60 uppercase tracking-[0.02em]">On Set · Director's Monitor</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 reveal reveal-delay-5">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-heading-sm font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.02em]">{stat.value}</p>
                  <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
