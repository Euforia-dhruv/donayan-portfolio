import { getDrivePdfs } from "@/lib/drive-pdfs";
import { buildArchiveItems } from "@/lib/archive";

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

/** Generic text that should never be shown as a "real" description. */
const GENERIC = new Set([
  "creative campaign", "brand project", "campaign", "project", "video", "film",
  "lorem ipsum", "untitled", "work", "production", "reel", "post",
]);

function isRealDescription(s?: string): boolean {
  if (!s || s.trim().length < 4) return false;
  return !GENERIC.has(s.trim().toLowerCase());
}

function norm(u?: string): string {
  return (u || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "");
}

/** Production wall — every production (videos, reels, posts, brand films…). */
export function buildProductionWallItems(projects: any[]): WallCardItem[] {
  const all = buildArchiveItems(projects).filter(
    (i) => i.kind !== "pdf" && (i.poster || i.preview),
  );

  const seen = new Set<string>();
  const out: WallCardItem[] = [];

  for (const i of all) {
    // Dedupe: same media + same client + same year => keep one.
    const mediaKey = norm(i.preview || i.source);
    const dupKey = `${mediaKey}|${norm(i.client)}|${norm(i.year)}`;
    if (seen.has(dupKey)) continue;
    seen.add(dupKey);

    const txt = `${i.categoryLabel} ${(i.tags || []).join(" ")}`.toLowerCase();
    const keys = new Set<string>(i.filterKeys || ["all"]);
    if (/campaign/.test(txt)) keys.add("campaigns");
    if (/editorial/.test(txt)) keys.add("editorial");
    if (/fashion/.test(txt)) keys.add("fashion");
    if (/youtube/.test(i.source) || i.kind === "youtube") keys.add("youtube");
    keys.add("all");

    const isCampaign = keys.has("campaigns") || /campaign/.test(txt);
    out.push({
      id: i.id,
      kind: i.kind,
      title: i.title,
      client: i.client,
      year: i.year,
      categoryLabel: i.categoryLabel,
      description: isRealDescription(i.description) ? i.description : "",
      platform: i.platform,
      source: i.source,
      preview: i.preview,
      poster: i.poster,
      aspect: i.aspect,
      tags: i.tags || [],
      filterKeys: [...keys],
      agency: isCampaign ? i.client : undefined,
      role: i.role,
    });
  }
  return out;
}

export const PRODUCTION_FILTERS = [
  { key: "all", label: "All" },
  { key: "commercials", label: "Commercials" },
  { key: "brand-films", label: "Brand Films" },
  { key: "music-videos", label: "Music Videos" },
  { key: "posts", label: "Posts" },
  { key: "reels", label: "Reels" },
  { key: "collaborations", label: "Collaborations" },
  { key: "viral", label: "Viral" },
] as const;

export const PDF_FILTERS = [
  { key: "all", label: "All" },
  { key: "decks", label: "Decks" },
  { key: "treatments", label: "Treatments" },
  { key: "casting", label: "Casting" },
  { key: "campaigns", label: "Campaigns" },
  { key: "brand", label: "Brand" },
] as const;
