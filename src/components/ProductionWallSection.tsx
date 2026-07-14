"use client";

import { useMemo } from "react";
import MasonryWall from "@/components/MasonryWall";
import { useProjects } from "@/lib/convex/site-data";
import { buildProductionWallItems, PRODUCTION_FILTERS } from "@/lib/wall-items";

export default function ProductionWallSection() {
  const { projects } = useProjects();
  const items = useMemo(() => buildProductionWallItems(projects), [projects]);
  return (
    <MasonryWall
      items={items}
      filters={PRODUCTION_FILTERS}
      eyebrow="Selected Work"
      title="Production Wall"
      searchPlaceholder="Search films, clients, tags…"
    />
  );
}
