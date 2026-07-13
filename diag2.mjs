import { chromium } from "playwright";

const URL = "https://donayan-three.vercel.app";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: "/tmp/shot_home_top.png" });

// scroll to wall
await page.evaluate(() => {
  const w = document.getElementById("wall");
  if (w) w.scrollIntoView();
});
await page.waitForTimeout(2000);
await page.screenshot({ path: "/tmp/shot_home_wall.png" });

const wallInfo = await page.evaluate(() => {
  const sec = document.getElementById("wall");
  if (!sec) return { found: false };
  const masonry = [...sec.querySelectorAll("div")].find((d) => /columns-/.test(d.className));
  const cards = masonry ? masonry.children.length : 0;
  const op = masonry ? getComputedStyle(masonry).opacity : "?";
  const rect = sec.getBoundingClientRect();
  // first card media
  let firstMedia = "none";
  if (masonry && masonry.children[0]) {
    const c = masonry.children[0];
    if (c.querySelector("video")) firstMedia = "video";
    else if (c.querySelector("img")) firstMedia = "img";
  }
  return { found: true, cards, masonryOpacity: op, top: Math.round(rect.top), height: Math.round(rect.height), firstCardMedia: firstMedia };
});

await page.goto(URL + "/wall", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: "/tmp/shot_wallroute.png" });
const wallRoute = await page.evaluate(() => {
  const sec = document.getElementById("wall");
  if (!sec) return { found: false };
  const masonry = [...sec.querySelectorAll("div")].find((d) => /columns-/.test(d.className));
  return { found: true, cards: masonry ? masonry.children.length : 0, opacity: masonry ? getComputedStyle(masonry).opacity : "?" };
});

const heroInfo = await page.evaluate(() => {
  const hero = document.querySelector('section[aria-label="Hero"]');
  if (!hero) return { hero: false };
  return {
    hero: true,
    videos: hero.querySelectorAll("video").length,
    imgs: hero.querySelectorAll("img").length,
    firstVidAutoplay: hero.querySelector("video")?.autoplay ?? null,
  };
});

console.log("HOME WALL:", JSON.stringify(wallInfo));
console.log("WALL ROUTE:", JSON.stringify(wallRoute));
console.log("HERO:", JSON.stringify(heroInfo));
await browser.close();
