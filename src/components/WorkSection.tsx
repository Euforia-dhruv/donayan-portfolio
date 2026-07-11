"use client";

import { useState, useMemo } from "react";
import projects from "@/data/projects.json";
import ProjectCard from "./ProjectCard";

const allRoles = ["All", "Director's Assistant", "Producer", "Project Management", "Social Strategy"];

export default function WorkSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  return (
    <section id="work" className="py-16 md:py-24 bg-parchment">
      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="max-w-3xl mb-10 md:mb-14">
          <p className="text-caption font-af font-[500] text-ash uppercase tracking-normal mb-3">
            Selected Work
          </p>
          <h2 className="text-heading-lg md:text-display font-ppmondwest font-[400] leading-[1.1] tracking-[-0.02em] text-graphite text-balance">
            Projects
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {allRoles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveFilter(role)}
              className={`flex-shrink-0 px-3 py-1.5 text-caption font-af font-[500] tracking-[-0.01em] transition-colors cursor-pointer rounded-lg ${
                activeFilter === role
                  ? "bg-ink-black text-white border border-ink-black"
                  : "bg-transparent text-charcoal border border-mist hover:border-fog"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-body-sm font-af font-[400] text-ash leading-[1]">
              No projects match that filter — try another.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
