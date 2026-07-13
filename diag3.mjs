import { chromium } from "playwright";

const URL = "https://donayan-three.vercel.app";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });

async function snap(name) {
  try {
    await page.screenshot({ path: name, fullPage: false, captureBeyondViewport: false, timeout: 8000 });
    console.log("shot ok:", name);
  } catch (e) {
    console.log("shot FAIL:", name, e.message.split("\n")[0]);
  }
}

// WALL ROUTE (wall is at top, should be visible)
await page.goto(URL + "/wall", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(3000);
await snap("/tmp/wallroute.png");
const wallRoute = await page.evaluate(() => {
  const sec = document.getElementById("wall");
  if (!sec) return { found: false };
  const masonry = [...sec.querySelectorAll("div")].find((d) => /columns-/.test(d.className));
  if (!masonry) return { found: true, masonry: false };
  const op = getComputedStyle(masonry).opacity;
  const cards = [...masonry.children].slice(0, 5).map((c) => {
    const v = c.querySelector("video");
    const i = c.querySelector("img");
    const r = c.getBoundingClientRect();
    return {
      h: Math.round(r.height),
      video: !!v,
      img: i ? i.getAttribute("src")?.slice(0, 40) : null,
      imgComplete: i ? i.complete : null,
      imgNatural: i ? `${i.naturalWidth}x${i.naturalHeight}` : null,
    };
  });
  return { found: true, masonry: true, opacity: op, cardCount: masonry.children.length, sample: cards };
});
console.log("WALL ROUTE:", JSON.stringify(wallRoute, null, 1));

// HOME
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
await snap("/tmp/home_top.png");
const hero = await page.evaluate(() => {
  const h = document.querySelector('section[aria-label="Hero"]');
  if (!h) return { hero: false };
  const v = h.querySelector("video");
  const i = h.querySelector("img");
  return { hero: true, videos: h.querySelectorAll("video").length, imgs: h.querySelectorAll("img").length,
    vidSrc: v ? v.currentSrc || v.getAttribute("src") : null,
    imgSrc: i ? i.getAttribute("src") : null };
});
console.log("HERO:", JSON.stringify(hero));

// scroll to wall on home
await page.evaluate(() => document.getElementById("wall")?.scrollIntoView());
await page.waitForTimeout(2000);
await snap("/tmp/home_wall.png");
const homeWall = await page.evaluate(() => {
  const sec = document.getElementById("wall");
  const masonry = sec && [...sec.querySelectorAll("div")].find((d) => /columns-/.test(d.className));
  return { opacity: masonry ? getComputedStyle(masonry).opacity : "?", cards: masonry ? masonry.children.length : 0 };
});
console.log("HOME WALL:", JSON.stringify(homeWall));

await browser.close();
