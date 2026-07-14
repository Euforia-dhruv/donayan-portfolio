// Build step: assemble the Production Wall manifest (src/lib/wall-items.json)
// entirely from data — no hardcoded item list.
//
//   1. SCAN    /public/assets/archive for supported media (authoritative
//              list of what actually exists).
//   2. GROUP    files by project number (e.g. 6.1–6.5 → project 6).
//   3. MAP      each project to its source URL via TXT.txt
//              (format:  `N: N<url>`  → project N → url).
//   4. ENRICH  title / category / year / platform / aspect from
//              src/lib/wall-meta.json (keyed by project number).
//   5. DESCRIBE description from src/lib/video-desc.json (generated from
//              public/video/txt.txt).
//   6. DETECT  real image aspect ratios with sharp.
//
// Warns (does not fail the build) when a project is missing metadata so the
// quality checklist ("no empty cards") is enforceable.
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const ARCHIVE = path.join(ROOT, "public/assets/archive");
const TXT = path.join(ARCHIVE, "TXT.txt");
const META = path.join(ROOT, "src/lib/wall-meta.json");
const DESC = path.join(ROOT, "src/lib/video-desc.json");
const OUT = path.join(ROOT, "src/lib/wall-items.json");

const VIDEO_EXT = new Set([".mp4", ".webm", ".ogg", ".mov", ".m4v"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function scan() {
  return walk(ARCHIVE)
    .map((f) => "/" + path.relative(path.join(ROOT, "public"), f).split(path.sep).join("/"))
    .filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return VIDEO_EXT.has(ext) || IMAGE_EXT.has(ext);
    })
    .sort();
}

function projectNumberOf(file) {
  const base = path.basename(file);
  const m = base.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function filtersFor(m, platform, kind) {
  const tags = new Set(["All"]);
  const cat = (m && m.category) || "";
  if (cat === "Commercial") tags.add("Commercials");
  else if (cat === "Brand Film") tags.add("Brand Films");
  else if (cat === "Fashion Film") {
    tags.add("Fashion Films");
    tags.add("Brand Films");
  } else if (cat === "Social Reel") tags.add("Reels");
  else if (cat === "Social Post") tags.add("Posts");
  else if (cat === "Campaign Still") tags.add("Campaigns");
  else if (cat) tags.add(cat + "s");
  if (m && m.collab) tags.add("Collaborations");
  tags.add(kind === "video" ? "Videos" : "Images");
  return [...tags];
}

async function detectAspect(file) {
  try {
    const abs = path.join(ROOT, "public", file.replace(/^\//, ""));
    const meta = await sharp(abs).metadata();
    if (meta.width && meta.height) return `${meta.width} / ${meta.height}`;
  } catch {
    /* ignore — fall back to meta.aspect */
  }
  return null;
}

async function main() {
  const files = scan();
  console.log(`\n[wall] scanned ${files.length} media files in /public/assets/archive`);

  // group by project number
  const groups = new Map();
  for (const f of files) {
    const n = projectNumberOf(f);
    if (n === null) {
      console.warn(`  ⚠ skipping unnumbered asset: ${f}`);
      continue;
    }
    if (!groups.has(n)) groups.set(n, []);
    groups.get(n).push(f);
  }
  for (const v of groups.values()) v.sort();

  // TXT.txt → project number → source url
  // Format per line:  `<num>https://...`  (num = leading digits,
  // url starts at the first "http").
  const urlByProject = {};
  if (fs.existsSync(TXT)) {
    for (const line of fs.readFileSync(TXT, "utf8").split("\n")) {
      const t = line.trim();
      if (!t) continue;
      const i = t.indexOf("http");
      if (i < 0) continue;
      const url = t.slice(i).trim();
      const num = parseInt(t.slice(0, i), 10);
      if (!Number.isNaN(num)) urlByProject[num] = url;
    }
  }

  const meta = JSON.parse(fs.existsSync(META) ? fs.readFileSync(META, "utf8") : "{}");
  const desc = JSON.parse(fs.existsSync(DESC) ? fs.readFileSync(DESC, "utf8") : "{}");

  const items = [];
  let problems = 0;
  for (const [num, groupFiles] of [...groups.entries()].sort((a, b) => a[0] - b[0])) {
    const isVideo = groupFiles.some((f) => VIDEO_EXT.has(path.extname(f).toLowerCase()));
    const kind = isVideo ? "video" : "image";
    const cover = groupFiles[0];
    const source = urlByProject[num] || "";
    const m = meta[num] || {};
    const title = m.title || path.basename(cover);
    const category = m.category || (kind === "video" ? "Video" : "Image");
    const year = m.year || "";
    const platform =
      m.platform ||
      (source.includes("instagram")
        ? "Instagram"
        : source.includes("youtube") || source.includes("youtu.be")
          ? "YouTube"
          : "External");
    const description = desc[cover] || groupFiles.map((f) => desc[f]).find(Boolean) || "";

    let aspect = m.aspect || (kind === "video" ? "16 / 9" : "1 / 1");
    if (!isVideo) {
      const detected = await detectAspect(cover);
      if (detected) aspect = detected;
    }

    // quality warnings
    const warn = (msg) => {
      console.warn(`  ⚠ project ${num} (${cover}): ${msg}`);
      problems++;
    };
    if (!source) warn("no source URL (TXT.txt)");
    if (!description) warn("no description");
    if (title === path.basename(cover)) warn("missing title");
    if (!category) warn("missing category");
    if (!year) warn("missing year");

    items.push({
      id: `p${num}`,
      number: num,
      kind,
      cover,
      gallery: groupFiles,
      grouping: groupFiles.length > 1,
      source,
      title,
      brand: m.brand || title,
      category,
      year,
      platform,
      description,
      aspect,
      collab: !!m.collab,
      filters: filtersFor(m, platform, kind),
    });
  }

  fs.writeFileSync(OUT, JSON.stringify(items, null, 2));
  console.log(
    `[wall] wrote src/lib/wall-items.json (${items.length} projects` +
      `${problems ? `, ${problems} metadata warnings` : ", 0 warnings"})`,
  );
}

main();
