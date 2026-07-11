"use client";

import { useEffect, useRef, useState } from "react";
import projects from "@/data/projects.json";

const allRoles = ["All", "Director's Assistant", "Producer", "Project Management", "Social Strategy"];

export default function ProductionLog() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section
      id="productions"
      ref={sectionRef}
      className="py-20 md:py-28 bg-cinema-black reveal"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-12 md:mb-16">
          <p className="text-caption font-sans font-[500] text-champagne uppercase tracking-[0.2em] mb-4">
            Archive
          </p>
          <h2 className="text-display md:text-hero font-display font-[400] leading-[0.95] tracking-[-0.04em] text-cinema-white text-balance">
            Production Log
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {allRoles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveFilter(role)}
              className={`flex-shrink-0 px-5 py-2.5 text-caption font-sans font-[500] uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer rounded ${
                activeFilter === role
                  ? "bg-champagne text-cinema-black"
                  : "bg-transparent text-cinema-white/50 border border-white/10 hover:border-white/30"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((project, i) => {
            const isExpanded = expandedId === project.id;
            return (
              <div
                key={project.id}
                className={`group cursor-pointer border border-white/5 rounded overflow-hidden transition-all duration-500 ${
                  isExpanded ? "lg:col-span-2 lg:row-span-2" : ""
                } ${isExpanded ? "bg-cinema-black/80" : "bg-smoke/50 hover:bg-smoke"}`}
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.6s ease ${i * 0.08}s forwards`,
                }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-cinema-black/80 via-transparent to-transparent z-10" />

                  {project.featured && (
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                      <span className="px-3 py-1 bg-champagne text-cinema-black text-caption font-sans font-[500] uppercase tracking-[0.1em] rounded">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 z-20">
                    <p className="text-caption font-sans font-[400] text-cinema-white/60 uppercase tracking-[0.1em]">
                      {project.year} &middot; {project.role}
                    </p>
                  </div>

                  <div className="w-full h-full bg-charcoal flex items-center justify-center">
                    <span className="text-heading-sm font-display font-[400] text-cinema-white/10">
                      {project.brand}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-heading-sm font-display font-[400] text-cinema-white leading-[1.2] tracking-[-0.01em]">
                    {project.title}
                  </h3>

                  {project.talents.length > 0 && (
                    <p className="mt-1 text-body-sm font-sans font-[400] text-cinema-white/50 tracking-[0.02em]">
                      Featuring {project.talents.join(", ")}
                    </p>
                  )}

                  <p className="mt-2 text-body-sm font-sans font-[300] text-cinema-white/40 leading-[1.4] line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-caption font-sans font-[500] text-champagne uppercase tracking-[0.1em]">
                    <span>View case study</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-champagne">
                      <path d="M3 6h6M9 6L6 3M9 6L6 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-body font-sans font-[300] text-cinema-white/40">
              No productions match that filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
