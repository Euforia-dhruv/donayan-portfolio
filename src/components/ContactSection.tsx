"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getMediaUrl } from "@/lib/media";
import { useSettings } from "@/lib/convex/site-data";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ContactSection() {
  const { settings } = useSettings();
  const sendMessage = useMutation(api.contact.create);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState<{ name: string; email: string; message: string }>({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const email = settings?.email || "donayan@donayan.com";
  const phone = settings?.phone || "+91 98765 43210";
  const instagram = settings?.instagram || "https://www.instagram.com/donayan_";
  const linkedin = settings?.linkedin || "https://linkedin.com/in/donayansahdev";

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formState.name || !formState.email || !formState.message) {
      setFormError("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      await sendMessage({
        name: formState.name,
        email: formState.email,
        message: formState.message,
      });
      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    } catch (err) {
      setFormError("Something didn't go through. Try again or email directly.");
    }
    setSubmitting(false);
  }, [formState, sendMessage]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-cinema-black overflow-hidden"
      aria-label="Contact"
    >
      <div
        className="absolute inset-0"
        style={{
          zIndex: 0,
          backgroundImage: `url(${getMediaUrl("/assets/images/thank-you.png")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.6,
        }}
      />

      <div
        className="absolute inset-0"
        style={{ zIndex: 1, background: "rgba(0,0,0,0.4)" }}
      />

      <div
        className="relative w-full max-w-[1400px] mx-auto px-8 md:px-10 pt-20 pb-16"
        style={{
          zIndex: 2,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-[420px]">
            <p className="text-caption font-switzer font-[400] text-gold uppercase tracking-[0.02em] mb-4">
              Contact
            </p>
            <h2 className="text-heading md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.03em] text-balance">
              Let&apos;s work together.
            </h2>
            <p className="mt-5 text-subheading font-switzer font-[300] text-stone leading-[1.4]">
              Available for freelance and in-house productions in Mumbai and across India.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-cinema-black text-body-sm font-switzer font-[400] uppercase tracking-[0.02em] no-underline transition-opacity hover:opacity-85"
                style={{ borderRadius: "1440px" }}
              >
                Start a Project
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            <div className="mt-10 space-y-4">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-body-sm font-switzer font-[400] text-stone no-underline hover:text-cinema-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13L2 4" />
                </svg>
                {email}
              </a>
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-body-sm font-switzer font-[400] text-stone no-underline hover:text-cinema-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-body-sm font-switzer font-[400] text-stone no-underline uppercase tracking-[0.02em] hover:text-cinema-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-body-sm font-switzer font-[400] text-stone no-underline uppercase tracking-[0.02em] hover:text-cinema-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
                </svg>
                Instagram
              </a>
            </div>
          </div>

          <div className="w-full max-w-[480px] justify-self-end">
            <div className="rounded-xl p-10 backdrop-blur-[6px] bg-[rgba(10,10,10,0.35)] border border-cinema-white/8">
              <p className="text-subheading font-switzer font-[300] text-cinema-white leading-[1.4] mb-4">
                Have a project in mind?
              </p>
              <p className="text-body-sm font-switzer font-[300] text-stone leading-[1.6] mb-6">
                Let&apos;s discuss your next production. Fill out the project brief and I&apos;ll get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="text-center py-6">
                  <p className="text-body font-switzer font-[400] text-gold">Thank you! I&apos;ll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-cinema-white/10 rounded-lg px-4 py-3 text-body-sm font-switzer text-cinema-white placeholder-cinema-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-cinema-white/10 rounded-lg px-4 py-3 text-body-sm font-switzer text-cinema-white placeholder-cinema-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                    required
                  />
                  <textarea
                    placeholder="Tell me about your project"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    rows={4}
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-cinema-white/10 rounded-lg px-4 py-3 text-body-sm font-switzer text-cinema-white placeholder-cinema-white/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                    required
                  />
                  {formError && <p className="text-xs text-red-400">{formError}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-cinema-black text-body-sm font-switzer font-[400] uppercase tracking-[0.02em] no-underline transition-opacity hover:opacity-85 disabled:opacity-50 cursor-pointer border-none"
                    style={{ borderRadius: "1440px" }}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
