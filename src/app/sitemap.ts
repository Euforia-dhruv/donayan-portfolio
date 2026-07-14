import type { MetadataRoute } from "next";

const BASE_URL = "https://donayan.com";

const ROUTES = [
  { url: "", changeFrequency: "weekly" as const, priority: 1 },
  { url: "/wall", changeFrequency: "weekly" as const, priority: 0.9 },
  { url: "/archive", changeFrequency: "monthly" as const, priority: 0.8 },
  { url: "/timeline", changeFrequency: "monthly" as const, priority: 0.7 },
  { url: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { url: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${BASE_URL}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
