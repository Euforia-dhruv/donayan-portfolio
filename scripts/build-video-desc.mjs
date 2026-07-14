// Build step: turn public/video/txt.txt (hand-edited descriptions, keyed by
// the wall asset file path) into a JSON map the archive consumes at render.
//
//   /assets/archive/1.mp4 :: Enamel-protection commercial for Pronamel.
//
// Falls back to the description already in wall-assets.json when a txt line is
// missing, so the txt file is purely an editorial override layer.
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const wall = JSON.parse(
  fs.readFileSync(path.join(ROOT, "src/lib/wall-assets.json"), "utf8"),
);

const txtPath = path.join(ROOT, "public/video/txt.txt");
const override = {};
if (fs.existsSync(txtPath)) {
  const txt = fs.readFileSync(txtPath, "utf8");
  for (const line of txt.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("::");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const desc = t.slice(i + 2).trim();
    if (key && desc) override[key] = desc;
  }
}

const map = {};
for (const w of wall) {
  map[w.file] = override[w.file] ?? w.description ?? "";
}
fs.writeFileSync(
  path.join(ROOT, "src/lib/video-desc.json"),
  JSON.stringify(map, null, 2),
);
const n = Object.values(map).filter(Boolean).length;
console.log(`[video-desc] wrote src/lib/video-desc.json (${n} descriptions)`);
