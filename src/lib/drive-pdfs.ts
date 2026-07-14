import driveManifest from "@/lib/pdf-drive-manifest.json";

const norm = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9]/g, "");

export interface DrivePdf {
  id: string;
  title: string;
  thumbnail: string | null;
  pdfUrl: string;
  type: "pdf";
  year: string;
  client: string;
  category: string;
  aspect?: string;
}

function driveId(url: string): string | null {
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

/**
 * Resolve the raw Drive manifest into validated, deduplicated PDF projects.
 * The generated manifest is produced by scripts/build-drive-pdfs.mjs, so
 * adding an entry to pdf-drive-source.json automatically creates a new card.
 */
export function getDrivePdfs(): DrivePdf[] {
  const seen = new Set<string>();
  const out: DrivePdf[] = [];

  for (const e of driveManifest as Array<{
    id: string;
    thumbnail: string;
    pdfUrl: string;
    title: string;
    client?: string;
    year?: string;
    category?: string;
    aspect?: string;
  }>) {
    const id = driveId(e.pdfUrl);
    if (!id) {
      console.warn(`[drive-pdfs] Skipping invalid Google Drive URL: ${e.pdfUrl}`);
      continue;
    }
    if (seen.has(id)) {
      // duplicate Drive file -> keep a single card
      continue;
    }
    seen.add(id);

    out.push({
      id: e.id || `drive-${id}`,
      title: e.title || "Untitled Document",
      thumbnail: e.thumbnail || null,
      pdfUrl: e.pdfUrl,
      type: "pdf",
      year: e.year || "",
      client: e.client || "",
      category: e.category || "Presentation / Deck",
      aspect: e.aspect,
    });
  }

  return out;
}
