import { getDrivePdfs } from "@/lib/drive-pdfs";

export interface WallCardItem {
  id: string;
  kind: "video" | "image" | "pdf" | "youtube" | "instagram";
  title: string;
  client: string;
  year: string;
  categoryLabel: string;
  description: string;
  platform: string;
  source: string;
  preview: string | null;
  poster: string | null;
  aspect: string;
  tags: string[];
  filterKeys: string[];
  agency?: string;
  role?: string;
  uniform?: boolean;
}

export function parseAspect(aspect: string): number {
  const m = String(aspect).split("/").map((n) => parseFloat(n.trim()));
  if (m.length === 2 && m[1]) return m[0] / m[1];
  return 1;
}

/** Derive an editorial category + one-line description from a PDF title. */
function pdfMeta(title: string): { category: string; description: string } {
  const t = title.toLowerCase();
  if (/pitch/.test(t)) return { category: "Pitch Deck", description: "Campaign Pitch Deck" };
  if (/ppm/.test(t)) return { category: "PPM Deck", description: "Pre-Production Meeting Deck" };
  if (/treatment|note|director/.test(t)) return { category: "Treatment", description: "Director's Treatment & Notes" };
  if (/cast/.test(t)) return { category: "Casting", description: "Casting Lookbook" };
  if (/brand/.test(t)) return { category: "Brand Film", description: "Brand Identity + Editorial" };
  if (/editorial|deck/.test(t)) return { category: "Editorial Deck", description: "Editorial Deck" };
  if (/campaign/.test(t)) return { category: "Campaign Deck", description: "Campaign Presentation" };
  return { category: "Presentation", description: "Presentation / Deck" };
}

function pdfFilterKeys(category: string): string[] {
  const keys = new Set<string>(["all", "editorial"]);
  const c = category.toLowerCase();
  if (/pitch|deck|editorial/.test(c)) keys.add("decks");
  if (/ppm/.test(c)) keys.add("decks");
  if (/treatment|note/.test(c)) keys.add("treatments");
  if (/cast/.test(c)) keys.add("casting");
  if (/campaign/.test(c)) keys.add("campaigns");
  if (/brand/.test(c)) keys.add("brand");
  return [...keys];
}

/** PDF wall — every doc thumbnail, each linking to its Google Drive PDF. */
export function buildPdfWallItems(): WallCardItem[] {
  return getDrivePdfs()
    .filter((d) => !!d.thumbnail)
    .map((d) => {
      const { category, description } = pdfMeta(d.title);
      return {
        id: d.id,
        kind: "pdf" as const,
        title: d.title,
        client: d.client,
        year: d.year,
        categoryLabel: category,
        description,
        platform: "PDF",
        source: d.pdfUrl,
        preview: d.thumbnail,
        poster: d.thumbnail,
        aspect: d.aspect || "3 / 4",
        tags: [],
        filterKeys: pdfFilterKeys(category),
        uniform: true,
      };
    });
}

export const PDF_FILTERS = [
  { key: "all", label: "All" },
  { key: "decks", label: "Decks" },
  { key: "treatments", label: "Treatments" },
  { key: "casting", label: "Casting" },
  { key: "campaigns", label: "Campaigns" },
  { key: "brand", label: "Brand" },
] as const;
