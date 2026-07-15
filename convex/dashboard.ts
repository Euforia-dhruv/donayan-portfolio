import { query } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

const DAY = 86_400_000;

function pct(last: number, prev: number) {
  if (prev <= 0) return { pct: last > 0 ? 100 : 0, isNew: last > 0 };
  return { pct: Math.round(((last - prev) / prev) * 100), isNew: false };
}

function dailySeries(items: { _creationTime?: number }[], now: number, days = 7) {
  const out: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const start = now - i * DAY;
    const end = start + DAY;
    out.push(
      items.filter((it) => {
        const t = it._creationTime ?? 0;
        return t >= start && t < end;
      }).length,
    );
  }
  return out;
}

function bytesSeries(items: { _creationTime?: number; size?: number }[], now: number, days = 7) {
  const out: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const start = now - i * DAY;
    const end = start + DAY;
    out.push(
      items.reduce((s, it) => {
        const t = it._creationTime ?? 0;
        return t >= start && t < end ? s + (it.size ?? 0) : s;
      }, 0),
    );
  }
  return out;
}

export const getDashboard = query({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const weekAgo = now - 7 * DAY;
    const twoWeeksAgo = now - 14 * DAY;

    const projects = await ctx.db.query("projects").collect();
    const wall = await ctx.db.query("wall").collect();
    const media = await ctx.db.query("media").collect();
    const messages = await ctx.db.query("contactMessages").collect();
    const timeline = await ctx.db.query("timeline").collect();
    const categories = await ctx.db.query("categories").collect();
    const testimonials = await ctx.db.query("testimonials").collect();
    const brands = await ctx.db.query("brands").collect();
    const pageViews = await ctx.db.query("pageViews").collect();
    const settings = await ctx.db.query("settings").first();

    const countIn = (items: { _creationTime?: number }[], from: number, to: number) =>
      items.filter((i) => {
        const t = i._creationTime ?? 0;
        return t >= from && t < to;
      }).length;

    const series7 = (items: { _creationTime?: number }[]) => dailySeries(items, now, 7);

    const kpi = (label: string, key: string, items: { _creationTime?: number }[], icon: string, color: string) => {
      const last = countIn(items, weekAgo, now);
      const prev = countIn(items, twoWeeksAgo, weekAgo);
      const g = pct(last, prev);
      return {
        key,
        label,
        value: items.length,
        icon,
        color,
        spark: series7(items),
        growth: g.pct,
        isNew: g.isNew,
        isBytes: false,
        sub: g.isNew ? `${last} new this week` : `${g.pct >= 0 ? "+" : ""}${g.pct}% vs last week`,
      };
    };

    const kpis = [
      kpi("Projects", "projects", projects, "LayoutGrid", "#c8a24d"),
      kpi("Wall Items", "wall", wall, "GalleryHorizontal", "#8a0467"),
      kpi("Media", "media", media, "Image", "#3b82f6"),
      kpi("Messages", "messages", messages, "MessageSquare", "#22c55e"),
      kpi("Timeline", "timeline", timeline, "Clock", "#a855f7"),
    ];

    // Views (real, from pageViews table)
    const viewDays = Array.from({ length: 7 }, (_, i) =>
      new Date(now - (6 - i) * DAY).toISOString().slice(0, 10),
    );
    const viewSeries = viewDays.map((d) => pageViews.find((r) => r.date === d)?.count ?? 0);
    const viewsLast7 = viewSeries.reduce((a, b) => a + b, 0);
    const prevViewDays = Array.from({ length: 7 }, (_, i) =>
      new Date(now - (13 - i) * DAY).toISOString().slice(0, 10),
    );
    const viewsPrev7 = prevViewDays
      .map((d) => pageViews.find((r) => r.date === d)?.count ?? 0)
      .reduce((a, b) => a + b, 0);
    const totalViews = pageViews.reduce((s, r) => s + r.count, 0);
    const vg = pct(viewsLast7, viewsPrev7);
    kpis.push({
      key: "views",
      label: "Views",
      value: totalViews,
      icon: "Eye",
      color: "#ec4899",
      spark: viewSeries,
      growth: vg.pct,
      isNew: vg.isNew,
      isBytes: false,
      sub: vg.isNew ? `${viewsLast7} this week` : `${vg.pct >= 0 ? "+" : ""}${vg.pct}% vs last week`,
    });

    // Storage (real bytes)
    const images = media.filter((m) => m.type === "image");
    const videos = media.filter((m) => m.type === "video");
    const pdfs = media.filter((m) => m.type === "pdf");
    const bytesByType = {
      images: images.reduce((s, m) => s + (m.size ?? 0), 0),
      videos: videos.reduce((s, m) => s + (m.size ?? 0), 0),
      pdfs: pdfs.reduce((s, m) => s + (m.size ?? 0), 0),
    };
    const totalBytes = media.reduce((s, m) => s + (m.size ?? 0), 0);
    const storageLast = media
      .filter((m) => (m._creationTime ?? 0) >= weekAgo)
      .reduce((s, m) => s + (m.size ?? 0), 0);
    const storagePrev = media
      .filter((m) => (m._creationTime ?? 0) >= twoWeeksAgo && (m._creationTime ?? 0) < weekAgo)
      .reduce((s, m) => s + (m.size ?? 0), 0);
    const sg = pct(storageLast, storagePrev);
    kpis.push({
      key: "storage",
      label: "Storage",
      value: totalBytes,
      icon: "HardDrive",
      color: "#f59e0b",
      spark: bytesSeries(media, now, 7),
      growth: sg.pct,
      isNew: sg.isNew,
      sub: sg.isNew ? "New files added" : `${sg.pct >= 0 ? "+" : ""}${sg.pct}% used this week`,
      isBytes: true,
    });

    // Projects by category
    const byCategory = categories
      .map((c) => ({ name: c.name, count: projects.filter((p) => p.category === c.name).length }))
      .sort((a, b) => b.count - a.count);
    const categorized = projects.filter((p) => p.category && categories.some((c) => c.name === p.category)).length;
    if (projects.length - categorized > 0) {
      byCategory.push({ name: "Uncategorized", count: projects.length - categorized });
    }

    // Media type breakdown (real)
    const mediaTypeBreakdown = [
      { name: "Videos", value: videos.length, color: "#3b82f6" },
      { name: "Photos", value: images.length, color: "#22c55e" },
      { name: "PDF", value: pdfs.length, color: "#f59e0b" },
      {
        name: "Reels",
        value: projects.filter((p) => /reel/i.test(p.category ?? "") || /reel/i.test(p.title)).length,
        color: "#ec4899",
      },
      {
        name: "Commercials",
        value: projects.filter((p) => /commercial/i.test(p.category ?? "")).length,
        color: "#8a0467",
      },
      {
        name: "Brand Films",
        value: projects.filter((p) => /brand/i.test(p.category ?? "")).length,
        color: "#c8a24d",
      },
      { name: "Timeline", value: timeline.length, color: "#a855f7" },
    ].filter((x) => x.value > 0);

    // Recent items
    const recentProjects = [...projects]
      .sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      .slice(0, 6)
      .map((p) => ({
        _id: p._id,
        title: p.title,
        status: p.status ?? (p.published ? "published" : "draft"),
        category: p.category ?? "—",
        thumbnail: p.thumbnail ?? null,
        _creationTime: p._creationTime ?? 0,
      }));

    const recentMediaRaw = [...media]
      .sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      .slice(0, 9);
    const recentMedia = await Promise.all(
      recentMediaRaw.map(async (m) => ({
        _id: m._id,
        name: m.name,
        type: m.type,
        size: m.size,
        url: await ctx.storage.getUrl(m.fileId),
        _creationTime: m._creationTime ?? 0,
      })),
    );

    const recentMessages = [...messages]
      .sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      .slice(0, 5)
      .map((m) => ({
        _id: m._id,
        name: m.name,
        email: m.email,
        subject: m.subject ?? "",
        message: m.message,
        status: m.status,
        _creationTime: m._creationTime ?? 0,
      }));

    const recentTimeline = [...timeline]
      .sort((a, b) => (b._creationTime ?? 0) - (a._creationTime ?? 0))
      .slice(0, 5)
      .map((t) => ({
        _id: t._id,
        company: t.company,
        roleTitle: t.roleTitle ?? "",
        startDate: t.startDate,
        _creationTime: t._creationTime ?? 0,
      }));

    // SEO health (real)
    const missingDescription = projects.filter((p) => !p.description || p.description.trim().length < 20).length;
    const missingThumbnail = projects.filter((p) => !p.thumbnail).length;
    const brokenLinks = projects.filter((p) => {
      const urls = [p.externalUrl, p.instagramUrl, p.youtubeUrl].filter(Boolean) as string[];
      return urls.some((u) => !/^https?:\/\//i.test(u));
    }).length;
    const duplicateContent = projects.length - new Set(projects.map((p) => p.title.toLowerCase())).size;

    return {
      kpis,
      byCategory,
      storage: {
        totalBytes,
        byType: bytesByType,
        counts: { images: images.length, videos: videos.length, pdfs: pdfs.length },
      },
      mediaTypeBreakdown,
      recentProjects,
      recentMedia,
      recentMessages,
      recentTimeline,
      seo: {
        missingDescription,
        missingThumbnail,
        brokenLinks,
        duplicateContent,
        total: projects.length,
      },
      counts: {
        projects: projects.length,
        wall: wall.length,
        media: media.length,
        messages: messages.length,
        timeline: timeline.length,
        categories: categories.length,
        testimonials: testimonials.length,
        brands: brands.length,
      },
      settings: settings
        ? {
            siteTitle: settings.siteTitle,
            instagram: settings.instagram,
            linkedin: settings.linkedin,
            youtube: settings.youtube,
          }
        : null,
      totalViews,
    };
  },
});
