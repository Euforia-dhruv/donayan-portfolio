"use client";

import { useRef, useEffect } from "react";
import siteContent from "@/data/site-content.json";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } }, { threshold: 0.1 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-36 overflow-hidden reveal bg-bone-white border-t border-ash/50">
      <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          <div className="lg:col-span-3">
            <p className="text-caption font-switzer font-[400] text-graphite uppercase tracking-[0.02em] mb-4 reveal reveal-delay-1">About</p>
            <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-ink-black leading-[1] tracking-[-0.03em] max-w-2xl mb-8 reveal reveal-delay-2">{siteContent.about.title}</h2>
            <div className="space-y-4 reveal reveal-delay-3">
              {siteContent.about.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-body md:text-subheading font-switzer font-[300] text-graphite leading-[1.6] max-w-2xl tracking-[-0.01em]">{para}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="relative aspect-[4/3] overflow-hidden mb-8 reveal reveal-delay-4">
              <img src="/hero-bg.jpg" alt="On set production" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-caption font-switzer font-[400] text-bone-white/60 uppercase tracking-[0.02em]">On Set · Director's Monitor</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 reveal reveal-delay-5">
              {siteContent.about.stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-heading-sm font-switzer font-[300] text-ink-black leading-[1] tracking-[-0.02em]">{stat.value}</p>
                  <p className="text-caption font-switzer font-[400] text-graphite uppercase tracking-[0.02em] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
