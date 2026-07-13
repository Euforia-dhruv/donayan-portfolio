import { chromium } from "playwright";
const URL = "https://donayan-three.vercel.app";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.emulateMedia({ reducedMotion: "reduce" });
await p.goto(URL + "/wall", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(4000);
const info = await p.evaluate(() => {
  const sec = document.getElementById("wall");
  const masonry = sec && [...sec.querySelectorAll("div")].find((d) => /columns-/.test(d.className));
  const totalImg = document.querySelectorAll("#wall img").length;
  const totalVideo = document.querySelectorAll("#wall video").length;
  const svgCount = document.querySelectorAll("#wall svg").length;
  let firstCardHTML = "NO MASONRY";
  if (masonry && masonry.children[0]) {
    firstCardHTML = masonry.children[0].innerHTML.slice(0, 600);
  }
  // also check first 3 img srcs anywhere in wall
  const imgSrcs = [...document.querySelectorAll("#wall img")].slice(0, 5).map((i) => i.currentSrc || i.getAttribute("src"));
  return { totalImg, totalVideo, svgCount, opacity: masonry ? getComputedStyle(masonry).opacity : "?", firstCardHTML, imgSrcs };
});
console.log(JSON.stringify(info, null, 1));
await b.close();
