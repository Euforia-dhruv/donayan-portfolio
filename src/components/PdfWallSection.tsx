"use client";

import { useMemo } from "react";
import MasonryWall from "@/components/MasonryWall";
import { buildPdfWallItems, PDF_FILTERS } from "@/lib/wall-items";

export default function PdfWallSection() {
  const items = useMemo(() => buildPdfWallItems(), []);
  return (
    <MasonryWall
      items={items}
      filters={PDF_FILTERS}
      eyebrow="Presentations & Treatments"
      title="Creative Library"
      searchPlaceholder="Search decks, pitches, treatments…"
      pdfWall
    />
  );
}
