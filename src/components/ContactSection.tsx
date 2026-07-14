"use client";

import { motion, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Icons                                                              */
/* ------------------------------------------------------------------ */
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */
const CONTACT_CARDS = [
  {
    key: "email",
    label: "Email",
    value: "ads.donayan@gmail.com",
    sub: "Opens mail client",
    href: "mailto:ads.donayan@gmail.com",
    external: false,
    icon: <MailIcon />,
  },
  {
    key: "whatsapp",
    label: "Phone / WhatsApp",
    value: "+91 98193 17834",
    sub: "Opens WhatsApp chat",
    href: "https://wa.me/919819317834",
    external: true,
    icon: <PhoneIcon />,
  },
  {
    key: "instagram",
    label: "Instagram",
    value: "@donayansahdev",
    sub: "View profile",
    href: "https://www.instagram.com/donayansahdev/",
    external: true,
    icon: <InstagramIcon />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "Donayan Sahdev",
    sub: "View profile",
    href: "https://www.linkedin.com/in/donayan?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    external: true,
    icon: <LinkedInIcon />,
  },
] as const;

const SERVICES = [
  "Commercials",
  "Brand Films",
  "Fashion Films",
  "Creative Direction",
  "Photography",
  "Campaigns",
  "Production",
  "Social Content",
];

const INQUIRY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdXeb-btHivYM9OJiNbev68zrPD868AcDY3dArmLIgMOpfoxw/viewform?usp=header";

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function ContactSection({
  titleAs = "h2",
}: {
  titleAs?: "h1" | "h2";
}) {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-cinema-black"
      aria-label="Contact"
    >
      {/* Luxury glow + subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 88% 0%, rgba(200,162,77,0.12), transparent 70%), radial-gradient(45% 40% at 0% 100%, rgba(200,162,77,0.06), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.6) 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
        {/* Header */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-caption font-switzer font-[400] uppercase tracking-[0.12em] text-gold">
            Contact
          </p>
          {titleAs === "h1" ? (
            <h1 className="mt-3 max-w-3xl font-switzer font-[300] leading-[1.02] tracking-[-0.03em] text-cinema-white text-heading sm:text-heading-lg">
              Let&apos;s Create Something Exceptional
            </h1>
          ) : (
            <h2 className="mt-3 max-w-3xl font-switzer font-[300] leading-[1.02] tracking-[-0.03em] text-cinema-white text-heading sm:text-heading-lg">
              Let&apos;s Create Something Exceptional
            </h2>
          )}
          <p className="mt-5 max-w-xl font-switzer font-[300] leading-[1.55] text-stone text-body">
            Whether you&apos;re planning a commercial, brand film, campaign, fashion shoot or
            digital content, I&apos;d love to hear about your project.
          </p>
        </motion.div>

        {/* Body */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-3 lg:gap-12">
          {/* Main: contact cards + inquiry */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {CONTACT_CARDS.map((c, i) => (
                <motion.a
                  key={c.key}
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={`${c.label}: ${c.value}`}
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.06 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group flex items-center gap-4 rounded-2xl border border-cinema-white/10 bg-white/[0.03] p-5 backdrop-blur-md transition-colors duration-300 hover:border-gold/40 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold transition-colors duration-300 group-hover:bg-gold/20">
                    <span className="h-5 w-5">{c.icon}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-switzer text-[10px] font-[400] uppercase tracking-[0.12em] text-stone/70">
                      {c.label}
                    </span>
                    <span className="mt-0.5 block truncate font-switzer text-body-sm font-[400] text-cinema-white">
                      {c.value}
                    </span>
                    <span className="mt-0.5 block font-switzer text-[11px] font-[300] text-stone/60">
                      {c.sub}
                    </span>
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Project inquiry CTA */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 flex flex-col items-start justify-between gap-5 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/[0.08] to-transparent p-6 backdrop-blur-md sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-switzer text-caption font-[400] uppercase tracking-[0.12em] text-gold/80">
                  Project Inquiry
                </p>
                <p className="mt-1 max-w-md font-switzer text-body-sm font-[300] leading-[1.5] text-cinema-white/80">
                  Tell me about your production — fill in a short brief and I&apos;ll get back to you.
                </p>
              </div>
              <a
                href={INQUIRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-7 py-3 font-switzer text-body-sm font-[400] uppercase tracking-[0.02em] text-cinema-black no-underline transition-opacity duration-300 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cinema-black"
              >
                Start Your Project
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M3 7h8M11 7L7 3M11 7L7 11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            <div className="rounded-2xl border border-cinema-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                  <span className="h-4 w-4"><GlobeIcon /></span>
                </span>
                <div>
                  <p className="font-switzer text-body-sm font-[400] text-cinema-white">Available Worldwide</p>
                  <p className="font-switzer text-[11px] font-[300] text-stone/60">Remote & on-location</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3 border-t border-cinema-white/10 pt-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                  <span className="h-4 w-4"><ClockIcon /></span>
                </span>
                <div>
                  <p className="font-switzer text-body-sm font-[400] text-cinema-white">24–48 Hours</p>
                  <p className="font-switzer text-[11px] font-[300] text-stone/60">Typical response time</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-cinema-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
              <p className="font-switzer text-caption font-[400] uppercase tracking-[0.12em] text-stone/70">
                Services
              </p>
              <ul className="mt-4 space-y-2.5">
                {SERVICES.map((s) => (
                  <li key={s} className="flex items-center gap-3 font-switzer text-body-sm font-[300] text-cinema-white/90">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
