"use client";

import { useEffect, useRef, useState } from "react";
import { useTestimonials } from "@/lib/convex/site-data";

export default function Testimonials() {
  const { testimonials } = useTestimonials();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } }, { threshold: 0.2 });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!testimonials.length) return;
    const interval = setInterval(() => setActive((prev) => (prev + 1) % testimonials.length), 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!testimonials.length) return null;

  return (
    <section ref={sectionRef} className="py-20 bg-cinema-black border-t border-cinema-white/8 reveal">
      <div className="max-w-[1400px] mx-auto px-8 md:px-10">
        <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-4">Testimonials</p>

        <div className="max-w-4xl">
          {testimonials.map((t, i) => (
            <div key={t._id} className={`transition-all duration-700 ${i === active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute"}`}
              style={i === active ? { position: "relative" } : {}}>
              <p className="text-heading-lg md:text-display font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] text-balance">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-6 text-body-sm font-switzer font-[400] text-stone uppercase tracking-[0.02em]">— {t.name}{t.company ? `, ${t.company}` : ""}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`transition-all duration-300 cursor-pointer border-none rounded-full ${i === active ? "bg-gold" : "bg-cinema-white/25"}`}
              style={{ width: i === active ? "24px" : "8px", height: "8px" }} />
          ))}
        </div>
      </div>
    </section>
  );
}
