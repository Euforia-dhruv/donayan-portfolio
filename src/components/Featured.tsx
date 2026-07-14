"use client";

import { useMemo } from "react";
import { useProjects } from "@/lib/convex/site-data";
import ProjectCard from "@/components/ProjectCard";

export default function Featured() {
  const { projects } = useProjects();

  const featured = useMemo(() => {
    const list = (projects || []).filter((p: any) => p.featured);
    return (list.length ? list : (projects || []).slice(0, 6)).slice(0, 6);
  }, [projects]);

  if (!featured.length) return null;

  return (
    <section
      id="featured"
      className="relative w-full bg-cinema-black"
      style={{ padding: "clamp(48px, 7vw, 110px) 0" }}
      aria-label="Featured Work"
    >
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-switzer text-caption font-[400] uppercase tracking-[0.12em] text-gold/70">
              Selected Work
            </p>
            <h2
              className="mt-3 font-switzer font-[300] leading-[0.98] tracking-[-0.03em]"
              style={{ fontSize: "clamp(36px, 5vw, 72px)", color: "#F5F5F2" }}
            >
              Featured
            </h2>
          </div>
          <p className="max-w-md font-switzer text-body-sm font-[300] leading-[1.6] text-stone">
            A curated set of commercials, brand films and social campaigns — built for
            screens that demand attention.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {featured.map((p: any, i: number) => (
            <ProjectCard key={p._id} project={p} index={i} size="feature" />
          ))}
        </div>
      </div>
    </section>
  );
}
