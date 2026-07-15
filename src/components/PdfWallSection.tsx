"use client";

import { useMemo } from "react";
import MasonryWall from "@/components/MasonryWall";
import { buildPdfWallItems, PDF_FILTERS } from "@/lib/wall-items";

// Hand-picked, visually strong decks shown on the home Creative Library.
// Categories are intentionally removed — just a tight, curated set.
const FEATURED = [
  "Centrum",
  "Godrej Capital",
  "Fossil",
  "IDEE",
  "AX Celebrity",
  "Artkalaa",
];

export default function PdfWallSection() {
  const items = useMemo(() => {
    const all = buildPdfWallItems();
    const wanted = FEATURED.map((f) => all.find((x) => x.title.includes(f))).filter(
      (x): x is NonNullable<typeof x> => Boolean(x),
    );
    const rest = all.filter((x) => !wanted.includes(x));
    return [...wanted, ...rest].slice(0, 6);
  }, []);

  return (
    <MasonryWall
      items={items}
      filters={PDF_FILTERS}
      eyebrow="Presentations & Treatments"
      title="Creative Library"
      searchPlaceholder="Search decks, pitches, treatments…"
      pdfWall
      hideFilters
    />
  );
}
