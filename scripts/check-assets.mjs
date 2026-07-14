// Prebuild: verify every Wall asset exists (fail build if missing) and
// generate a PDF manifest mapping each PDF to its PNG cover.
// Run automatically via `npm run build` (prebuild hook).
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const strip = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

let failed = false;

// --- 1. Wall assets (scanned from /public/assets/archive) ----------------
const VIDEO_EXT = new Set([".mp4", ".webm", ".ogg", ".mov", ".m4v"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const wallAssets = walk(path.join(PUBLIC, "assets/archive"))
  .map((f) => "/" + path.relative(PUBLIC, f).split(path.sep).join("/"))
  .filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return VIDEO_EXT.has(ext) || IMAGE_EXT.has(ext);
  });
console.log(`\n[wall] scanned ${wallAssets.length} archive assets...`);
for (const f of wallAssets) {
  if (!fs.existsSync(path.join(PUBLIC, f.replace(/^\//, "")))) {
    console.error(`  ✗ MISSING WALL ASSET: ${f}`);
    failed = true;
  }
}
if (!failed) console.log(`  ✓ all ${wallAssets.length} wall assets present`);

// --- 2. PDFs -> covers ----------------------------------------------------
const allFiles = walk(PUBLIC);
const pdfs = allFiles.filter((f) => f.toLowerCase().endsWith(".pdf"));
console.log(`\n[pdf] scanning ${pdfs.length} PDFs for covers...`);
const manifest = [];
for (const pdfAbs of pdfs) {
  const dir = path.dirname(pdfAbs);
  const base = path.basename(pdfAbs, ".pdf");
  const pdfKey = strip(base);
  let pngs = [];
  try {
    pngs = fs.readdirSync(dir).filter((n) => n.toLowerCase().endsWith(".png"));
  } catch {
    pngs = [];
  }

  let best = null;
  let bestScore = -1;
  for (const n of pngs) {
    const key = strip(path.basename(n, ".png"));
    let score = -1;
    if (key === pdfKey) score = 2;
    else if (pdfKey.startsWith(key)) score = 1;
    else if (key.startsWith(pdfKey)) score = 0;
    if (
      score > bestScore ||
      (score === bestScore && key.length > (best ? best.key.length : 0))
    ) {
      bestScore = score;
      best = { name: n, key };
    }
  }

  const pdfServed = "/" + path.relative(PUBLIC, pdfAbs).split(path.sep).join("/");
  const coverServed = best
    ? "/" + path.relative(PUBLIC, path.join(dir, best.name)).split(path.sep).join("/")
    : null;

  if (!coverServed) {
    console.warn(`  ⚠ no PNG cover for: ${pdfServed} (will render fallback card)`);
  } else {
    console.log(`  ✓ ${pdfServed} -> ${coverServed}`);
  }
  manifest.push({ pdf: pdfServed, cover: coverServed, name: base });
}

const manifestPath = path.join(ROOT, "src/lib/pdf-manifest.json");
if (pdfs.length === 0) {
  // During a deploy, .vercelignore prunes the large PDF binaries before the
  // build runs, so no PDFs are visible here. Keep the committed manifest
  // (generated from source) instead of overwriting it with an empty list.
  if (fs.existsSync(manifestPath) && JSON.parse(fs.readFileSync(manifestPath, "utf8")).length > 0) {
    console.log(`\n[pdf] no PDFs visible at build time — kept existing ${manifestPath}`);
  } else {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n[pdf] wrote src/lib/pdf-manifest.json (${manifest.length} entries)`);
  }
} else {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n[pdf] wrote src/lib/pdf-manifest.json (${manifest.length} entries)`);
}

if (failed) {
  console.error("\n✗ Build aborted: missing wall assets (see above).");
  process.exit(1);
}
console.log("\n✓ asset check passed");
