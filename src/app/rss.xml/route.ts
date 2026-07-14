import { BASE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

const CHANNEL = {
  title: "Donayan Sahdev",
  link: BASE_URL,
  description:
    "Creative Producer & Freelance Director's Assistant — commercials, brand films, music videos, fashion campaigns and digital productions.",
};

const ITEMS = [
  { title: "Production Wall", link: `${BASE_URL}/wall`, desc: "Selected productions, commercials, brand films and music videos." },
  { title: "Production Archive", link: `${BASE_URL}/archive`, desc: "Every production, document and deck — fully archived." },
  { title: "Production Timeline", link: `${BASE_URL}/timeline`, desc: "Career timeline across freelance and in-house production." },
  { title: "About", link: `${BASE_URL}/about`, desc: "Creative Producer and Director based in Mumbai, India." },
  { title: "Contact", link: `${BASE_URL}/contact`, desc: "Start a project inquiry with Donayan Sahdev." },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const now = new Date().toUTCString();
  const items = ITEMS.map(
    (it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${it.link}</link>
      <guid isPermaLink="true">${it.link}</guid>
      <description>${escapeXml(it.desc)}</description>
      <pubDate>${now}</pubDate>
    </item>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(CHANNEL.title)}</title>
    <link>${CHANNEL.link}</link>
    <atom:link href="${CHANNEL.link}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(CHANNEL.description)}</description>
    <language>en-in</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>Next.js</generator>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
