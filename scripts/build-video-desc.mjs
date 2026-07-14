// Build step: turn public/video/txt.txt (hand-edited descriptions, keyed by
// the wall asset file path) into a JSON map the archive/wall consume.
//
//   /assets/archive/1.mp4 :: <description>
//
// The list of known files is derived by SCANNING /public/assets/archive
// (so dropping a new asset in the folder is picked up automatically — no
// hardcoded item list). Descriptions come only from txt.txt overrides.
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const ARCHIVE = path.join(ROOT, "public/assets/archive");
const TXT = path.join(ROOT, "public/video/txt.txt");
const OUT = path.join(ROOT, "src/lib/video-desc.json");

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

const override = {};
if (fs.existsSync(TXT)) {
  for (const line of fs.readFileSync(TXT, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("::");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const desc = t.slice(i + 2).trim();
    if (key && desc) override[key] = desc;
  }
}

const files = scan();
const map = {};
for (const f of files) map[f] = override[f] || "";

fs.writeFileSync(OUT, JSON.stringify(map, null, 2));
const n = Object.values(map).filter(Boolean).length;
console.log(`[video-desc] wrote src/lib/video-desc.json (${n}/${files.length} descriptions)`);
