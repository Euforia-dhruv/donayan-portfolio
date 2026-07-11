"use client";

import { useState } from "react";
import siteContent from "@/data/site-content.json";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) { setSubmitted(true); form.reset(); }
      else { setError(true); }
    } catch { setError(true); }
  }

  return (
    <section id="contact" className="py-24 md:py-36 bg-cinema-black border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-4">
          Contact
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2 className="text-display md:text-hero font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white text-balance">
              {siteContent.contact.header}
            </h2>
            <p className="mt-6 text-lead font-sans font-[300] text-cinema-white/60 leading-[1.5] max-w-md">
              {siteContent.contact.intro}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-champagne text-cinema-black text-body-sm font-sans font-[500] uppercase tracking-[0.15em] no-underline rounded hover:bg-champagne/90 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.getElementById("contact-form");
                  if (form) form.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Send a message
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={siteContent.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-white/20 text-cinema-white text-body-sm font-sans font-[500] uppercase tracking-[0.15em] no-underline rounded hover:bg-white/5 transition-all duration-300"
              >
                {siteContent.footer.resumeLabel}
              </a>
            </div>

            <div className="mt-10 space-y-3">
              <a
                href={`mailto:${siteContent.social.email}`}
                className="block text-body-sm font-sans font-[400] text-cinema-white/60 no-underline hover:text-champagne transition-colors"
              >
                {siteContent.social.email}
              </a>
              <a
                href={`tel:${siteContent.social.phone}`}
                className="block text-body-sm font-sans font-[400] text-cinema-white/60 no-underline hover:text-champagne transition-colors"
              >
                {siteContent.social.phone}
              </a>
              <div className="flex gap-4 mt-4">
                <a
                  href={siteContent.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm font-sans font-[400] text-cinema-white/40 no-underline uppercase tracking-[0.1em] hover:text-champagne transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div id="contact-form">
            {submitted ? (
              <div className="glass rounded p-8">
                <p className="text-lead font-sans font-[300] text-champagne leading-[1.5]">
                  {siteContent.contact.confirmation}
                </p>
              </div>
            ) : (
              <form
                action="https://formspree.io/f/your-form-id"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="name" className="block text-caption font-sans font-[500] text-cinema-white/60 uppercase tracking-[0.1em] mb-2">Name</label>
                  <input type="text" id="name" name="name" required
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 text-cinema-white text-body-sm font-sans font-[300] rounded focus:outline-none focus:border-champagne transition-colors"
                    placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-caption font-sans font-[500] text-cinema-white/60 uppercase tracking-[0.1em] mb-2">Email</label>
                  <input type="email" id="email" name="email" required
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 text-cinema-white text-body-sm font-sans font-[300] rounded focus:outline-none focus:border-champagne transition-colors"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-caption font-sans font-[500] text-cinema-white/60 uppercase tracking-[0.1em] mb-2">Message</label>
                  <textarea id="message" name="message" required rows={4}
                    className="w-full px-5 py-3.5 bg-white/5 border border-white/10 text-cinema-white text-body-sm font-sans font-[300] rounded focus:outline-none focus:border-champagne transition-colors resize-none"
                    placeholder="Tell me about your project..." />
                </div>
                {error && <p className="text-body-sm font-sans text-champagne">{siteContent.contact.error}</p>}
                <button type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-champagne text-cinema-black text-body-sm font-sans font-[500] uppercase tracking-[0.15em] rounded hover:bg-champagne/90 transition-all duration-300 cursor-pointer border-none">
                  {siteContent.contact.submitLabel}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
