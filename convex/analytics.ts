import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// First-party analytics. All site events are stored here and aggregated for
// the Admin → Analytics dashboard. This is intentionally public (analytics is
// non-sensitive, like the contact form) but writes are validated and size-
// capped per event.

const EVENT_TYPES = new Set([
  "page_view",
  "wall_open",
  "project_open",
  "contact_submit",
  "cta_click",
  "pdf_download",
  "outbound_link",
  "youtube_play",
  "instagram_open",
]);

function parseUA(ua: string | undefined): { device: string; browser: string } {
  const s = (ua || "").toLowerCase();
  let device = "Desktop";
  if (/ipad|tablet|kindle|playbook|silk/.test(s) || (/(android|webos|iphone|blackberry|iemobile|opera mini)/.test(s) && /mobile/.test(s) === false && /tablet/.test(s))) device = "Tablet";
  else if (/mobi|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/.test(s)) device = "Mobile";
  let browser = "Other";
  if (/edg\//.test(s)) browser = "Edge";
  else if (/opr\/|opera/.test(s)) browser = "Opera";
  else if (/chrome|crios/.test(s) && !/edg\//.test(s)) browser = "Chrome";
  else if (/firefox|fxios/.test(s)) browser = "Firefox";
  else if (/safari/.test(s) && !/chrome/.test(s)) browser = "Safari";
  return { device, browser };
}

export const insertEvent = mutation({
  args: {
    type: v.string(),
    path: v.optional(v.string()),
    refId: v.optional(v.string()),
    refTitle: v.optional(v.string()),
    label: v.optional(v.string()),
    referrer: v.optional(v.string()),
    ua: v.optional(v.string()),
    country: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!EVENT_TYPES.has(args.type)) return null;
    const { device, browser } = parseUA(args.ua);
    const referrer = args.referrer && !args.referrer.includes("donayan.com") ? args.referrer : undefined;
    await ctx.db.insert("analyticsEvents", {
      type: args.type,
      path: args.path,
      refId: args.refId,
      refTitle: args.refTitle,
      label: args.label,
      referrer,
      ua: args.ua,
      country: args.country || undefined,
      device,
      browser,
      sessionId: args.sessionId,
      ts: Date.now(),
    });
    return null;
  },
});

// Backwards-compatible alias kept for any lingering references.
export const trackView = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("analyticsEvents", {
      type: "page_view",
      device: "Unknown",
      browser: "Unknown",
      ts: Date.now(),
    });
  },
});

// Public HTTP endpoint consumed by the Next.js middleware (server-side page
// views with accurate country/device/referrer headers).
export const ingest = action({
  args: {
    type: v.string(),
    path: v.optional(v.string()),
    refId: v.optional(v.string()),
    refTitle: v.optional(v.string()),
    label: v.optional(v.string()),
    referrer: v.optional(v.string()),
    ua: v.optional(v.string()),
    country: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(api.analytics.insertEvent, args);
    return { ok: true };
  },
});

function topN<K extends string>(counts: Map<K, number>, n: number): { key: K; count: number }[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}

export const getDashboard = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("analyticsEvents").collect();

    let pageViews = 0;
    const sessions = new Set<string>();
    const pages = new Map<string, number>();
    const projects = new Map<string, number>();
    const devices = new Map<string, number>();
    const countries = new Map<string, number>();
    const referrers = new Map<string, number>();
    const ctas = new Map<string, number>();
    let youtubePlays = 0;
    let instagramOpens = 0;
    let pdfDownloads = 0;
    let outbound = 0;
    let wallOpens = 0;
    let projectOpens = 0;
    let contactSubmits = 0;

    for (const e of events) {
      if (e.sessionId) sessions.add(e.sessionId);
      if (e.type === "page_view") {
        pageViews++;
        if (e.path) pages.set(e.path, (pages.get(e.path) || 0) + 1);
      }
      if (e.device) devices.set(e.device, (devices.get(e.device) || 0) + 1);
      if (e.country) countries.set(e.country, (countries.get(e.country) || 0) + 1);
      if (e.referrer) referrers.set(e.referrer, (referrers.get(e.referrer) || 0) + 1);
      if (e.type === "wall_open") {
        wallOpens++;
        if (e.refTitle) projects.set(e.refTitle, (projects.get(e.refTitle) || 0) + 1);
      }
      if (e.type === "project_open") {
        projectOpens++;
        if (e.refTitle) projects.set(e.refTitle, (projects.get(e.refTitle) || 0) + 1);
      }
      if (e.type === "cta_click" && e.label) ctas.set(e.label, (ctas.get(e.label) || 0) + 1);
      if (e.type === "youtube_play") youtubePlays++;
      if (e.type === "instagram_open") instagramOpens++;
      if (e.type === "pdf_download") pdfDownloads++;
      if (e.type === "outbound_link") outbound++;
      if (e.type === "contact_submit") contactSubmits++;
    }

    return {
      total: events.length,
      pageViews,
      visitors: sessions.size,
      sessions: sessions.size,
      wallOpens,
      projectOpens,
      youtubePlays,
      instagramOpens,
      pdfDownloads,
      outbound,
      contactSubmits,
      topPages: topN(pages, 8),
      topProjects: topN(projects, 8),
      devices: topN(devices, 6),
      countries: topN(countries, 8),
      referrers: topN(referrers, 8),
      ctaClicks: topN(ctas, 10),
    };
  },
});
