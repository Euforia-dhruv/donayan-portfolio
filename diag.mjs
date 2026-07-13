import { chromium } from "playwright";

const URL = "https://donayan-three.vercel.app";

const browser = await chromium.launch();
const page = await browser.newPage();

const consoleErrors = [];
const pageErrors = [];
const failedReq = [];
const convexReq = [];

page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
page.on("pageerror", (e) => pageErrors.push(e.message));
page.on("requestfailed", (r) => failedReq.push(`${r.url()} :: ${r.failure()?.errorText}`));
page.on("response", (r) => {
  const u = r.url();
  if (u.includes("convex")) convexReq.push(`${r.status()} ${u}`);
  if (r.status() >= 400) failedReq.push(`HTTP ${r.status()} ${u}`);
});

await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(7000); // let Convex WS + query resolve

const wall = await page.evaluate(() => {
  const sec = document.querySelector("#wall");
  if (!sec) return { found: false };
  const masonry = [...sec.querySelectorAll("div")].find((d) => /columns-/.test(d.className));
  const cards = masonry ? masonry.children.length : 0;
  return { found: true, cards };
});

const videos = await page.evaluate(() => {
  return [...document.querySelectorAll("video")].map((v) => ({
    src: (v.currentSrc || v.src || "").slice(0, 90),
    autoplay: v.autoplay,
    muted: v.muted,
    playsInline: v.playsInline,
    loop: v.loop,
    preload: v.preload,
    paused: v.paused,
    currentTime: Number(v.currentTime.toFixed(2)),
    readyState: v.readyState,
    error: v.error ? v.error.message : null,
  }));
});

console.log("=== WALL ===");
console.log(JSON.stringify(wall, null, 2));
console.log("=== VIDEOS (count=" + videos.length + ") ===");
console.log(JSON.stringify(videos, null, 2));
console.log("=== CONSOLE ERRORS (" + consoleErrors.length + ") ===");
console.log(consoleErrors.slice(0, 25).join("\n---\n"));
console.log("=== PAGE ERRORS (" + pageErrors.length + ") ===");
console.log(pageErrors.slice(0, 25).join("\n---\n"));
console.log("=== FAILED/4xx REQUESTS (" + failedReq.length + ") ===");
console.log(failedReq.slice(0, 30).join("\n"));
console.log("=== CONVEX REQUESTS (" + convexReq.length + ") ===");
console.log(convexReq.slice(0, 20).join("\n"));

await browser.close();
