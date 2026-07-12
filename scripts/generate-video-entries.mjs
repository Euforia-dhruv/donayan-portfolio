import { readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ARCHIVE_DIR = resolve("public/assets/archive");
const OUTPUT_PATH = resolve("src/data/video-entries.json");

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

const WALL_CARDS = [
  { title: "Centrum",     src: "/PPM Decks/Centrum.png",            pdf: null,                                            w: 400, h: 225 },
  { title: "HDFC KVS",    src: "/PPM Decks/HDFC.png",               pdf: "/PPM Decks/HDFC KVS Post PPM Deck.pdf",         w: 440, h: 248 },
  { title: "Murgi",       src: "/Movie - OTT pitches/Murgi 1.png",  pdf: "/Movie - OTT pitches/Murgi.pdf",                 w: 185, h: 329 },
  { title: "Ponds BB Cream", src: "/Treatment Notes/ponds.png",     pdf: "/Treatment Notes/Ponds  BB cream TN.pdf",        w: 420, h: 236 },
  { title: "Just Be",     src: "/Marketing Pitch/Just be.png",      pdf: "/Marketing Pitch/Just Be.pdf",                   w: 360, h: 203 },
  { title: "Tanishq",     src: "/Others/Tanishq.png",               pdf: "/Others/Tanishq Casting.pdf",                    w: 220, h: 293 },
  { title: "Sprite",      src: "/PPM Decks/Sprite.png",             pdf: null,                                            w: 340, h: 255 },
  { title: "IDEE",        src: "/PPM Decks/IDEE.png",               pdf: "/PPM Decks/IDEE PPM.pdf",                       w: 360, h: 270 },
  { title: "Godrej Capital", src: "/Treatment Notes/godrej.png",    pdf: "/Treatment Notes/Godrej Capital - Director_s Note.pdf", w: 340, h: 255 },
  { title: "OOOL Digital", src: "/Marketing Pitch/oool.png",        pdf: "/Marketing Pitch/OOOL Digital Strategy.pdf",     w: 340, h: 255 },
  { title: "AX",          src: "/PPM Decks/AX.png",                 pdf: "/PPM Decks/AX Celebrity Shoot SS_25.pdf",       w: 230, h: 288 },
  { title: "Artkalaa",    src: "/Marketing Pitch/artkalaa.png",     pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",       w: 235, h: 294 },
  { title: "Kinder",      src: "/PPM Decks/Kinder.png",             pdf: "/PPM Decks/Kinder Print Shoot.pdf",             w: 220, h: 293 },
  { title: "Kitser",      src: "/Marketing Pitch/kister.png",       pdf: "/Marketing Pitch/Kitser August Sale.pdf",       w: 225, h: 300 },
  { title: "Pathan Bros", src: "/Movie - OTT pitches/Pathan 2.png", pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf", w: 225, h: 300 },
  { title: "Deva",        src: "/Marketing Pitch/Deva.png",         pdf: "/Marketing Pitch/Deva_s Khayal.pdf",            w: 225, h: 281 },
  { title: "Fossil",      src: "/Treatment Notes/fossil.png",       pdf: "/Treatment Notes/Fossil - SS_25 - PPM DECK.pdf", w: 235, h: 294 },
  { title: "Lifestyle",   src: "/Others/life.png",                  pdf: "/Others/Lifestyle SS_24 Cast Batch 5 (Bangkok).pdf", w: 320, h: 240 },
  { title: "The Bubbling Fish", src: "/Marketing Pitch/the.png",    pdf: "/Marketing Pitch/The Bubbling Fish and Nirala - The Plan.pdf", w: 235, h: 294 },
  { title: "Murgi",       src: "/Movie - OTT pitches/Murgi.png",    pdf: "/Movie - OTT pitches/Murgi.pdf",                 w: 230, h: 288 },
  { title: "Pathan Bros", src: "/Movie - OTT pitches/Pathan 1.png", pdf: "/Movie - OTT pitches/Pathan Brothers Series.pdf", w: 240, h: 300 },
  { title: "Artkalaa",    src: "/Marketing Pitch/artkalaa 2.png",   pdf: "/Marketing Pitch/Artkalaa Pitch Deck.pdf",       w: 200, h: 200 },
];

const urlMap = {};
for (const line of TXT_URLS.trim().split("\n")) {
  const m = line.match(/^(\d+)/);
  if (m) urlMap[parseInt(m[0], 10)] = line.slice(m[0].length).trim();
}

/* --- Orientation --- */

function classifyVideo(url) {
  const u = url.toLowerCase();
  if (u.includes("youtube.com/shorts") || u.includes("youtu.be/shorts"))
    return { w: 1080, h: 1920 };
  if (u.includes("instagram.com/reel"))
    return { w: 1080, h: 1920 };
  if (u.includes("youtube.com") || u.includes("youtu.be"))
    return { w: 1920, h: 1080 };
  if (u.includes("instagram.com/p/"))
    return { w: 1080, h: 1350 };
  return { w: 1920, h: 1080 };
}

function parseJpegDimensions(filePath) {
  const buf = readFileSync(filePath);
  let i = 2;
  while (i < buf.length - 1) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
    }
    const len = buf.readUInt16BE(i + 2);
    i += 2 + len;
  }
  return null;
}

/* --- Gather archive entries --- */

const files = readdirSync(ARCHIVE_DIR);

const multiImages = {};
for (const f of files) {
  const m = f.match(/^(\d+)\.(\d+)\.jpg$/);
  if (m) {
    const id = parseInt(m[1], 10);
    (multiImages[id] ??= []).push(f);
  }
}

const singleImages = new Set();
for (const f of files) {
  const m = f.match(/^(\d+)\.jpg$/);
  if (m) singleImages.add(parseInt(m[1], 10));
}

function getDimensions(id, images) {
  if (images && images.length > 0) {
    const p = resolve(ARCHIVE_DIR, images[0]);
    const d = parseJpegDimensions(p);
    if (d) return d;
  }
  if (singleImages.has(id)) {
    const p = resolve(ARCHIVE_DIR, `${id}.jpg`);
    const d = parseJpegDimensions(p);
    if (d) return d;
  }
  const url = urlMap[id];
  if (url) return classifyVideo(url);
  return { w: 1920, h: 1080 };
}

function calcColSpan(w, h) {
  const a = w / h;
  if (a > 1.3) return 2;
  return 1;
}

const allIds = [...new Set([...Object.keys(SAVEDLY_CDN).map(Number), ...Object.keys(urlMap).map(Number)])].sort((a, b) => a - b);
const entries = [];

for (const id of allIds) {
  const url = urlMap[id];
  if (!url) continue;
  const images = multiImages[id] || null;
  const dims = getDimensions(id, images);
  const videoUrl = SAVEDLY_CDN[id] || null;
  entries.push({
    id,
    url,
    hasMp4: !!videoUrl,
    videoUrl,
    images,
    hasImage: singleImages.has(id),
    w: dims.w,
    h: dims.h,
    colSpan: calcColSpan(dims.w, dims.h),
    src: null,
  });
}

/* --- Add wall cards --- */

for (let i = 0; i < WALL_CARDS.length; i++) {
  const c = WALL_CARDS[i];
  entries.push({
    id: 101 + i,
    url: c.pdf || "",
    hasMp4: false,
    videoUrl: null,
    images: null,
    hasImage: true,
    w: c.w,
    h: c.h,
    colSpan: calcColSpan(c.w, c.h),
    src: c.src,
    title: c.title,
  });
}

writeFileSync(OUTPUT_PATH, JSON.stringify(entries, null, 2));
console.log(`→ Generated ${entries.length} entries → ${OUTPUT_PATH}`);
