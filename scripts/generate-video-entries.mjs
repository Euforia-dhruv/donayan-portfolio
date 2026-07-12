import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const VIDEOS_DIR = resolve("public/assets/videos");
const TXT_PATH = resolve("public/assets/videos/TXT.txt");
const OUTPUT_PATH = resolve("src/data/video-entries.json");

// Savedly links — in order matching sorted MP4 IDs
const SAVEDLY_URLS = [
  "https://savedly.net/f/e4d7gzfy",
  "https://savedly.net/f/6ytu2vbc",
  "https://savedly.net/f/xqjk8x6h",
  "https://savedly.net/f/7b9phbj8",
  "https://savedly.net/f/ekyurq4f",
  "https://savedly.net/f/mppg2us8",
  "https://savedly.net/f/avjkj6yp",
  "https://savedly.net/f/c8cyhdgt",
  "https://savedly.net/f/nzz4q3jv",
  "https://savedly.net/f/n32xw4uy",
  "https://savedly.net/f/grr6rqrj",
  "https://savedly.net/f/ctv8mvnq",
  "https://savedly.net/f/72r24bhx",
  "https://savedly.net/f/btnbpg4s",
  "https://savedly.net/f/ax82rtvt",
  "https://savedly.net/f/btyxtmd9",
  "https://savedly.net/f/7932dbz3",
  "https://savedly.net/f/f429ctnm",
  "https://savedly.net/f/mjjwcrkn",
  "https://savedly.net/f/q58xsp88",
];

function extractSavedlyCode(url) {
  const m = url.match(/savedly\.net\/f\/([a-z0-9]+)/);
  return m ? m[1] : null;
}

// Parse TXT.txt for id → click URL mapping
const urlMap = {};
for (const line of readFileSync(TXT_PATH, "utf-8").trim().split("\n")) {
  const m = line.match(/^(\d+)/);
  if (m) {
    urlMap[parseInt(m[0], 10)] = line.slice(m[0].length).trim();
  }
}

const files = readdirSync(VIDEOS_DIR);
const mp4Ids = [...new Set(
  files.filter((f) => f.endsWith(".mp4")).map((f) => parseInt(f.replace(".mp4", ""), 10))
)].sort((a, b) => a - b);

// Map savedly links to MP4 IDs 1:1 by order
const savedlyMap = {};
for (let i = 0; i < mp4Ids.length && i < SAVEDLY_URLS.length; i++) {
  const code = extractSavedlyCode(SAVEDLY_URLS[i]);
  if (code) savedlyMap[mp4Ids[i]] = `https://cdn.savedly.net/${code}`;
}

// Build image arrays (e.g. 6.1.jpg, 6.2.jpg → ["6.1.jpg", "6.2.jpg"])
const multiImages = {};
for (const f of files) {
  const m = f.match(/^(\d+)\.(\d+)\.jpg$/);
  if (m) {
    const id = parseInt(m[1], 10);
    (multiImages[id] ??= []).push(f);
  }
}

const allIds = new Set([...mp4Ids, ...Object.keys(urlMap).map(Number)]);
const entries = [];
for (const id of [...allIds].sort((a, b) => a - b)) {
  const url = urlMap[id];
  if (!url) continue;
  const hasMp4 = !!savedlyMap[id];
  const images = multiImages[id] || null;
  entries.push({ id, url, hasMp4, images, videoUrl: savedlyMap[id] || null });
}

writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2));
console.log(`→ Generated ${entries.length} video entries → ${OUTPUT_PATH}`);
