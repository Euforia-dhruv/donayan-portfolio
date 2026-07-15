import { getPlatformLabel, getYouTubeMaxResThumbnail } from "@/lib/video-utils";
import type { WallItem } from "@/types/wall";

// JSON imports resolved by Next at build time. The wall is assembled by
// scripts/build-wall.mjs entirely from /public/assets/archive.
import wallItemsRaw from "@/lib/wall-items.json";
import { getDrivePdfs } from "@/lib/drive-pdfs";

const WALL_ITEMS = wallItemsRaw as WallItem[];

const COLLAB_URLS = new Set([
  "https://www.instagram.com/reel/C9Hady1yVDJ/",
  "https://www.instagram.com/p/C6BbgzXoyLR/",
  "https://www.instagram.com/reel/C7RB6gGoVDQ/",
  "https://www.instagram.com/p/Cz-2Mi0C6Bg/",
]);

const VIRAL_TITLES = new Set([
  "Pronamel Active Shield",
  "Centrum Claims",
  "The Bear House",
  "Sprite Heat Happens",
  "Fossil SS'25",
  "Kinder Print Shoot",
  "IDEE Campaign",
  "Pathan Brothers",
]);

export type ArchiveKind = "video" | "image" | "pdf" | "youtube" | "instagram";

export interface ArchiveItem {
  id: string;
  kind: ArchiveKind;
  title: string;
  client: string;
  year: string;
  categoryLabel: string;
  credits: string[];
  tags: string[];
  source: string;
  preview: string | null;
  poster: string | null;
  aspect: string;
  platform: string;
  description: string;
  role?: string;
  orientation?: string;
  pdf?: string;
  filterKeys: string[];
}

function norm(u?: string): string {
  return (u || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/[?#].*$/, "")
    .replace(/\/$/, "");
}

const isLocalVideo = (u?: string) => !!u && /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(u);
const isLocalImage = (u?: string) => !!u && /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(u);

function projectFilterKeys(p: any): string[] {
  const keys: string[] = [];
  const url = p.externalUrl || "";
  const isIG = url.includes("instagram.com");
  const isReel = url.includes("/reel/");
  const isPost = isIG && !isReel;
  const isYT = url.includes("youtube") || url.includes("youtu.be");
  const cat = (p.category || "").toLowerCase();

  if (cat.includes("commercial") || cat.includes("fashion") || cat.includes("celebrity")) keys.push("commercials");
  if (cat.includes("music")) keys.push("music-videos");
  if (cat.includes("brand")) keys.push("brand-films");
  if (cat.includes("behind")) keys.push("commercials");
  if (cat.includes("digital") || cat.includes("social")) {
    if (isReel) keys.push("reels");
    else if (isPost) keys.push("posts");
    else keys.push("reels");
  }
  if (isPost) keys.push("posts");
  if (isReel) keys.push("reels");
  if (isYT && !isReel) {
    if (cat.includes("commercial") || cat.includes("fashion") || cat.includes("celebrity")) keys.push("commercials");
    else if (cat.includes("music")) keys.push("music-videos");
    else if (cat.includes("brand")) keys.push("brand-films");
    else keys.push("commercials");
  }
  if (url && COLLAB_URLS.has(url)) keys.push("collaborations");
  if (p.featured || VIRAL_TITLES.has(p.title)) keys.push("viral");
  return keys;
}

function deriveKind(preview: string | null, url: string): ArchiveKind {
  if (preview && isLocalVideo(preview)) return "video";
  if (preview && isLocalImage(preview)) return "image";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("youtube") || url.includes("youtu.be")) return "youtube";
  return "image";
}

/**
 * Build a single, deduplicated list of every archived work:
 *  - Productions from Convex (enriched with any local preview from the wall assets)
 *  - Wall-managed media (videos/images) not already represented by a production
 *  - Documents (PDFs) from the Google Drive export
 */
export function buildArchiveItems(projects: any[]): ArchiveItem[] {
  const items: ArchiveItem[] = [];
  const usedWallSources = new Set<string>();

  // 1) Productions
  const orientationAspect: Record<string, string> = {
    portrait: "9 / 16",
    square: "1 / 1",
    landscape: "16 / 9",
  };
  for (const p of projects || []) {
    const url = p.externalUrl || "";
    const match = WALL_ITEMS.find((w) => norm(w.source) === norm(url));
    let preview: string | null = null;
    let aspect = orientationAspect[p.orientation || ""] || "16 / 9";
    let poster: string | null = p.thumbnail || null;

    if (match) {
      usedWallSources.add(norm(match.source));
      if (isLocalVideo(match.cover)) preview = match.cover;
      else if (isLocalImage(match.cover)) preview = match.cover;
      aspect = match.aspect || aspect;
      if (isLocalImage(match.cover)) poster = match.cover;
    } else if ((p.videos || []).some(isLocalVideo)) {
      preview = (p.videos || []).find(isLocalVideo);
    }

    // Detect YouTube aspect automatically: Shorts are vertical (9:16), regular
    // watch links are horizontal (16:9). This keeps YouTube cards in the same
    // responsive aspect-ratio system as every other media type.
    if (url.includes("youtube") || url.includes("youtu.be")) {
      if (url.includes("shorts")) aspect = "9 / 16";
      else if (aspect === "9 / 16" && p.orientation !== "portrait") aspect = "16 / 9";
    }

    const ytThumb = url.includes("youtube") || url.includes("youtu.be") ? getYouTubeMaxResThumbnail(url) : null;
    if (!poster && ytThumb) poster = ytThumb;

    const kind = deriveKind(preview, url);
    const keys = projectFilterKeys(p);
    keys.push("all");

    items.push({
      id: `prod-${p._id}`,
      kind,
      title: p.title || p.brand || "Untitled",
      client: p.brand || p.client || "",
      year: p.year || "",
      categoryLabel: p.category || "Work",
      credits: p.credits || [],
      tags: p.tags || [],
      source: url,
      preview,
      poster,
      aspect,
      platform: getPlatformLabel(url),
      description: p.description || "",
      role: p.role || undefined,
      orientation: p.orientation || undefined,
      filterKeys: keys,
    });
  }

  // 2) Wall-managed media (data-driven) not already represented by a production
  for (const w of WALL_ITEMS) {
    if (usedWallSources.has(norm(w.source))) continue;
    const isVid = isLocalVideo(w.cover);
    const isImg = isLocalImage(w.cover);
    const keys: string[] = ["all", ...w.filters.filter((f) => f !== "All")];

    items.push({
      id: `wall-${w.id}`,
      kind: isVid ? "video" : "image",
      title: w.title,
      client: w.platform,
      year: w.year || "",
      categoryLabel: w.category,
      credits: [],
      tags: [],
      source: w.source,
      preview: w.cover,
      poster: isImg ? w.cover : null,
      aspect: w.aspect,
      platform: w.platform,
      description: w.description,
      filterKeys: keys,
    });
  }

  // 3) Documents (PDFs) — driven by the Google Drive manifest.
  //    Clicking a card opens the Drive PDF in a new tab.
  for (const d of getDrivePdfs()) {
    items.push({
      id: d.id,
      kind: "pdf",
      title: d.title,
      client: d.client,
      year: d.year,
      categoryLabel: d.category,
      credits: [],
      tags: [],
      source: d.pdfUrl,
      preview: d.thumbnail,
      poster: d.thumbnail,
      aspect: "3 / 4",
      platform: "PDF",
      description: "",
      pdf: d.pdfUrl,
      filterKeys: ["all", "pdf"],
    });
  }

  return items;
}
