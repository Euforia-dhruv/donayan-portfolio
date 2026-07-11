"use client";

import { useState, useRef } from "react";
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
    <section id="contact" className="py-24 md:py-36 bg-cream-paper border-t border-charcoal/10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <p className="font-geist font-[500] text-charcoal/50 uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
          Contact
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2 className="font-gelica font-[500] text-cocoa-ink leading-[1.08] text-balance lowercase"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
              {siteContent.contact.header}
            </h2>
            <p className="mt-6 font-geist font-[300] text-charcoal/60 leading-[1.5] max-w-md" style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}>
              {siteContent.contact.intro}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-cream-paper font-geist font-[500] uppercase no-underline transition-all duration-300 rounded-xl"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
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
                className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal/20 text-charcoal/60 font-geist font-[500] uppercase no-underline rounded-xl hover:border-charcoal/40 hover:text-charcoal transition-all duration-300"
                style={{ fontSize: "11px", letterSpacing: "0.15em" }}
              >
                {siteContent.footer.resumeLabel}
              </a>
            </div>

            <div className="mt-10 space-y-3">
              <a
                href={`mailto:${siteContent.social.email}`}
                className="block font-geist font-[400] text-charcoal/60 no-underline hover:text-cocoa-ink transition-colors" style={{ fontSize: "14px" }}
              >
                {siteContent.social.email}
              </a>
              <a
                href={`tel:${siteContent.social.phone}`}
                className="block font-geist font-[400] text-charcoal/60 no-underline hover:text-cocoa-ink transition-colors" style={{ fontSize: "14px" }}
              >
                {siteContent.social.phone}
              </a>
              <div className="flex gap-4 mt-4">
                <a
                  href={siteContent.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-geist font-[400] text-charcoal/40 no-underline uppercase hover:text-cocoa-ink transition-colors" style={{ fontSize: "12px", letterSpacing: "0.1em" }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div id="contact-form">
            {submitted ? (
              <div className="bg-dew-drop rounded-xl p-8 border border-charcoal/5">
                <p className="font-gelica font-[400] text-cocoa-ink leading-[1.5]" style={{ fontSize: "18px" }}>
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
                  <label htmlFor="name" className="block font-geist font-[500] text-charcoal/60 uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>Name</label>
                  <input type="text" id="name" name="name" required
                    className="w-full px-5 py-3.5 bg-dew-drop border border-charcoal/10 text-charcoal font-geist font-[300] rounded-xl focus:outline-none focus:border-charcoal/30 transition-colors"
                    style={{ fontSize: "14px" }}
                    placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block font-geist font-[500] text-charcoal/60 uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>Email</label>
                  <input type="email" id="email" name="email" required
                    className="w-full px-5 py-3.5 bg-dew-drop border border-charcoal/10 text-charcoal font-geist font-[300] rounded-xl focus:outline-none focus:border-charcoal/30 transition-colors"
                    style={{ fontSize: "14px" }}
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block font-geist font-[500] text-charcoal/60 uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.1em" }}>Message</label>
                  <textarea id="message" name="message" required rows={4}
                    className="w-full px-5 py-3.5 bg-dew-drop border border-charcoal/10 text-charcoal font-geist font-[300] rounded-xl focus:outline-none focus:border-charcoal/30 transition-colors resize-none"
                    style={{ fontSize: "14px" }}
                    placeholder="Tell me about your project..." />
                </div>
                {error && <p className="font-geist font-[400] text-cocoa-ink" style={{ fontSize: "13px" }}>{siteContent.contact.error}</p>}
                <button type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-charcoal text-cream-paper font-geist font-[500] uppercase rounded-xl hover:bg-charcoal/90 transition-all duration-300 cursor-pointer border-none"
                  style={{ fontSize: "11px", letterSpacing: "0.15em" }}>
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
