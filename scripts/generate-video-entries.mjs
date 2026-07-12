import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ARCHIVE_DIR = resolve("public/assets/archive");
const TXT_PATH = resolve("public/assets/archive/TXT.txt");
const OUTPUT_PATH = resolve("src/data/video-entries.json");

// Savedly CDN URLs keyed by MP4 ID (files are too large for git, served via CDN)
const SAVEDLY_CDN = {
  1: "https://cdn.savedly.net/e4d7gzfy",
  2: "https://cdn.savedly.net/6ytu2vbc",
  3: "https://cdn.savedly.net/xqjk8x6h",
  4: "https://cdn.savedly.net/7b9phbj8",
  5: "https://cdn.savedly.net/ekyurq4f",
  9: "https://cdn.savedly.net/mppg2us8",
  10: "https://cdn.savedly.net/avjkj6yp",
  11: "https://cdn.savedly.net/c8cyhdgt",
  12: "https://cdn.savedly.net/nzz4q3jv",
  13: "https://cdn.savedly.net/n32xw4uy",
  16: "https://cdn.savedly.net/grr6rqrj",
  17: "https://cdn.savedly.net/ctv8mvnq",
  18: "https://cdn.savedly.net/72r24bhx",
  19: "https://cdn.savedly.net/btnbpg4s",
  23: "https://cdn.savedly.net/ax82rtvt",
  24: "https://cdn.savedly.net/btyxtmd9",
  25: "https://cdn.savedly.net/7932dbz3",
  26: "https://cdn.savedly.net/f429ctnm",
  27: "https://cdn.savedly.net/mjjwcrkn",
  28: "https://cdn.savedly.net/q58xsp88",
};

const TXT_URLS = `
1https://www.youtube.com/watch?v=1wqdb9s3kfo
2https://www.youtube.com/watch?v=zlQc2GHojL8
3https://www.youtube.com/watch?v=E924AYIaCRw
4https://www.instagram.com/reel/DPVoyKujVe4/
5https://youtu.be/F9m4xEH2-dU
6https://www.instagram.com/p/Cz-2Mi0C6Bg/
9https://www.instagram.com/pocketfm.stories/reel/C24lSvovffw/
10https://www.instagram.com/p/C7bjXlbtp4Z/
11https://www.instagram.com/p/C-MkhP6ykXP/
12https://www.instagram.com/p/C4h8FkuN7Li/
13https://www.instagram.com/p/C7RB6gGoVDQ/
14https://www.instagram.com/p/C6BbgzXoyLR/
15https://www.instagram.com/p/C2Zu8u2p7di/
16https://www.instagram.com/p/C9Hady1yVDJ/
17https://www.instagram.com/reel/C22aMEvoiJl/?utm_source=ig_web_copy_link
18https://www.instagram.com/reel/Cr0W-g_NBpu/?utm_source=ig_web_copy_link
19https://youtube.com/shorts/kVqN7LIbLUM?si=oTajKf2mpI3djwMy
22https://www.instagram.com/p/C2uMuHjJmk_/
23https://www.youtube.com/watch?app=desktop&v=or5XQteDzYU
24https://www.instagram.com/p/CmoS25uhkQG/
25https://www.instagram.com/p/ClgcOJiDf2n/
26https://www.youtube.com/watch?v=W2KMt80-Kg0
27https://www.youtube.com/watch?feature=shared&fbclid=PAZXh0bgNhZW0CMTEAAadpVEpFYvty656IN9z_noVfym2_c5Bs8TR4Og10GSvEkgiJ0uM1E29xRg22Cw_aem_8GNvfG_hk81mjmB0XyyD0A&v=OjwGqh_jB6Y
28https://www.youtube.com/watch?v=RKjF5jTDbC8&t=1s
`;

const urlMap = {};
for (const line of TXT_URLS.trim().split("\n")) {
  const m = line.match(/^(\d+)/);
  if (m) urlMap[parseInt(m[0], 10)] = line.slice(m[0].length).trim();
}

const files = readdirSync(ARCHIVE_DIR);

// Multi-image groups (e.g. 6.1.jpg, 6.2.jpg → tracked in git)
const multiImages = {};
for (const f of files) {
  const m = f.match(/^(\d+)\.(\d+)\.jpg$/);
  if (m) {
    const id = parseInt(m[1], 10);
    (multiImages[id] ??= []).push(f);
  }
}

// Single-image set (e.g. 14.jpg → tracked in git)
const singleImages = new Set();
for (const f of files) {
  const m = f.match(/^(\d+)\.jpg$/);
  if (m) singleImages.add(parseInt(m[1], 10));
}

const allIds = [...new Set([...Object.keys(SAVEDLY_CDN).map(Number), ...Object.keys(urlMap).map(Number)])].sort((a, b) => a - b);
const entries = [];

for (const id of allIds) {
  const url = urlMap[id];
  if (!url) continue;
  const videoUrl = SAVEDLY_CDN[id] || null;
  const images = multiImages[id] || null;
  entries.push({
    id,
    url,
    hasMp4: !!videoUrl,
    videoUrl,
    images,
    hasImage: singleImages.has(id),
  });
}

writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2));
console.log(`→ Generated ${entries.length} video entries → ${OUTPUT_PATH}`);
