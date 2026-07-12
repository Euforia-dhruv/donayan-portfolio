"use client";

import { useEffect, useRef, useState } from "react";
import siteContent from "@/data/site-content.json";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el); return () => obs.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(false);
    const form = e.currentTarget; const data = new FormData(form);
    try { const res = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } }); if (res.ok) { setSubmitted(true); form.reset(); } else setError(true); } catch { setError(true); }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center bg-cinema-black overflow-hidden"
    >
      {/* Full background image with gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,.88), rgba(0,0,0,.72)), url('/assets/images/thank-you.png')",
          backgroundPosition: "70% center, 70% center",
          backgroundSize: "cover, cover",
          backgroundRepeat: "no-repeat, no-repeat",
          opacity: 1,
        }}
      />

      <div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-10 py-16 md:py-20"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left – Contact Info */}
          <div className="max-w-[420px]">
            <p className="text-caption font-switzer font-[400] text-gold uppercase tracking-[0.02em] mb-4">Contact</p>
            <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] text-balance">
              {siteContent.contact.header}
            </h2>
            <p className="mt-5 text-subheading font-switzer font-[300] text-stone leading-[1.4]">
              {siteContent.contact.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact-form" onClick={(e) => { e.preventDefault(); const f = document.getElementById("contact-form"); if (f) f.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cinema-black text-body-sm font-switzer font-[400] uppercase tracking-[0.02em] no-underline transition-opacity hover:opacity-85"
                style={{ borderRadius: "1440px" }}>
                Send a message
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
              <a href={siteContent.resumePdf} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-cinema-white/10 text-stone text-body-sm font-switzer font-[400] uppercase tracking-[0.02em] no-underline hover:border-cinema-white/30 hover:text-cinema-white transition-colors"
                style={{ borderRadius: "1440px" }}>
                {siteContent.footer.resumeLabel}
              </a>
            </div>

            <div className="mt-10 space-y-3">
              <a href={`mailto:${siteContent.social.email}`} className="block text-body-sm font-switzer font-[400] text-stone no-underline hover:text-cinema-white transition-colors">{siteContent.social.email}</a>
              <a href={`tel:${siteContent.social.phone}`} className="block text-body-sm font-switzer font-[400] text-stone no-underline hover:text-cinema-white transition-colors">{siteContent.social.phone}</a>
              <div className="flex gap-4 mt-3">
                <a href={siteContent.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-body-sm font-switzer font-[400] text-stone no-underline uppercase tracking-[0.02em] hover:text-cinema-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Right – Premium Form */}
          <div id="contact-form" className="w-full max-w-[480px] justify-self-end">
            {submitted ? (
              <div className="rounded-xl bg-[#141414]/80 backdrop-blur-sm border border-cinema-white/8 p-10">
                <p className="text-subheading font-switzer font-[300] text-cinema-white leading-[1.4]">{siteContent.contact.confirmation}</p>
              </div>
            ) : (
              <form action="https://formspree.io/f/your-form-id" method="POST" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-2.5">Name</label>
                  <input type="text" id="name" name="name" required
                    className="w-full px-5 py-4 bg-[#141414]/60 backdrop-blur-sm border border-cinema-white/12 text-cinema-white text-body-sm font-switzer font-[300] rounded-[10px] placeholder:text-cinema-white/25 focus:outline-none focus:border-gold/50 focus:bg-[#141414]/80 transition-all duration-300"
                    placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-2.5">Email</label>
                  <input type="email" id="email" name="email" required
                    className="w-full px-5 py-4 bg-[#141414]/60 backdrop-blur-sm border border-cinema-white/12 text-cinema-white text-body-sm font-switzer font-[300] rounded-[10px] placeholder:text-cinema-white/25 focus:outline-none focus:border-gold/50 focus:bg-[#141414]/80 transition-all duration-300"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em] mb-2.5">Message</label>
                  <textarea id="message" name="message" required rows={4}
                    className="w-full px-5 py-4 bg-[#141414]/60 backdrop-blur-sm border border-cinema-white/12 text-cinema-white text-body-sm font-switzer font-[300] rounded-[10px] placeholder:text-cinema-white/25 focus:outline-none focus:border-gold/50 focus:bg-[#141414]/80 transition-all duration-300 resize-none"
                    placeholder="Tell me about your project..." />
                </div>
                {error && <p className="text-body-sm font-switzer text-stone">{siteContent.contact.error}</p>}
                <button type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-cinema-black text-body-sm font-switzer font-[400] uppercase tracking-[0.02em] hover:opacity-85 transition-all duration-300 cursor-pointer border-none rounded-[10px]"
                  style={{ borderRadius: "1440px" }}>
                  {siteContent.contact.submitLabel}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
