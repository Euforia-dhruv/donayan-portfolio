import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ARCHIVE_DIR = resolve("public/assets/archive");
const TXT_PATH = resolve("public/assets/archive/TXT.txt");
const OUTPUT_PATH = resolve("src/data/video-entries.json");

// Parse TXT.txt for id → URL mapping
const urlMap = {};
for (const line of readFileSync(TXT_PATH, "utf-8").trim().split("\n")) {
  const m = line.match(/^(\d+)/);
  if (m) {
    urlMap[parseInt(m[0], 10)] = line.slice(m[0].length).trim();
  }
}

const files = readdirSync(ARCHIVE_DIR);

// Collect MP4 files
const mp4Ids = new Set(
  files.filter((f) => f.endsWith(".mp4")).map((f) => parseInt(f.replace(".mp4", ""), 10))
);

// Build multi-image groups (e.g. 6.1.jpg, 6.2.jpg → ["6.1.jpg", "6.2.jpg"])
const multiImages = {};
for (const f of files) {
  const m = f.match(/^(\d+)\.(\d+)\.jpg$/);
  if (m) {
    const id = parseInt(m[1], 10);
    (multiImages[id] ??= []).push(f);
  }
}

// Build single-image set (e.g. 14.jpg)
const singleImages = new Set();
for (const f of files) {
  const m = f.match(/^(\d+)\.jpg$/);
  if (m) singleImages.add(parseInt(m[1], 10));
}

const allIds = new Set([...mp4Ids, ...Object.keys(urlMap).map(Number)]);
const entries = [];

for (const id of [...allIds].sort((a, b) => a - b)) {
  const url = urlMap[id];
  if (!url) continue;

  const hasMp4 = mp4Ids.has(id);
  const images = multiImages[id] || null;
  const hasImage = singleImages.has(id);

  entries.push({ id, url, hasMp4, images, hasImage });
}

writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2));
console.log(`→ Generated ${entries.length} video entries → ${OUTPUT_PATH}`);
