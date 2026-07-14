// Build step: turn the raw Drive PDF source (basename + Google Drive link)
// into a resolved, validated manifest that the archive consumes.
//
// - Resolves each thumbnail to its real location under /public/assets/docs
//   (subfolder or flat — whatever the environment actually uses).
// - Enriches titles/client/year from the generated local pdf-manifest.
// - Deduplicates by Google Drive file id (same PDF linked twice => one card).
// - Validates Drive URL + thumbnail existence; warns and skips bad entries.
//
// Runs from prebuild (and predev) so new source entries appear automatically.
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const DOCS = path.join(PUBLIC, "assets", "docs");

const source = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/lib/pdf-drive-source.json"), "utf8"),
);
let localMeta = {};
try {
  localMeta = JSON.parse(
    fs.readFileSync(path.join(ROOT, "src/lib/pdf-manifest.json"), "utf8"),
  );
} catch {
  localMeta = [];
}

const norm = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9]/g, "");

// 1) Map every real doc file (basename -> served path)
function walk(dir, out = {}) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out[norm(e.name)] = "/" + path.relative(PUBLIC, p).split(path.sep).join("/");
  }
  return out;
}
const fileMap = walk(DOCS);

// 2) Local metadata by cover basename
const metaByCover = new Map();
for (const d of localMeta) {
  if (!d.cover) continue;
  const base = (d.cover.split("/").pop() || "").toLowerCase();
  metaByCover.set(norm(base), d);
}

function driveId(url) {
  const m = String(url).match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function prettyName(n) {
  return String(n)
    .replace(/_s\s/g, "'s ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveTitle(filename) {
  return String(filename)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const seen = new Set();
const out = [];
let skipped = 0;

for (const entry of source) {
  const id = driveId(entry.pdfUrl);
  const base = (entry.thumbnail || "").split("/").pop() || entry.thumbnail || "";

  if (!id) {
    console.warn(`  ⚠ [drive-pdfs] invalid Google Drive URL, skipping: ${entry.thumbnail} -> ${entry.pdfUrl}`);
    skipped++;
    continue;
  }
  if (seen.has(id)) continue; // duplicate by Drive file id

  const served = fileMap[norm(base)];
  if (!served) {
    console.warn(`  ⚠ [drive-pdfs] thumbnail missing on disk, skipping: ${entry.thumbnail}`);
    skipped++;
    continue;
  }
  seen.add(id);

  const meta = metaByCover.get(norm(base)) || {};
  const title = meta.name ? prettyName(meta.name) : deriveTitle(base);

  out.push({
    id: `drive-${id}`,
    thumbnail: served,
    pdfUrl: entry.pdfUrl,
    type: "pdf",
    title,
    client: meta.client || "",
    year: meta.year || "",
    category: "Presentation / Deck",
  });
}

fs.writeFileSync(
  path.join(ROOT, "src/lib/pdf-drive-manifest.json"),
  JSON.stringify(out, null, 2),
);
console.log(
  `\n[drive-pdfs] wrote src/lib/pdf-drive-manifest.json (${out.length} entries, ${skipped} skipped)`,
);
