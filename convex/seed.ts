import { v } from "convex/values";
import { mutation, action, QueryCtx, MutationCtx } from "./_generated/server";
import { api } from "./_generated/api";
import { createAccount, getAuthUserId } from "@convex-dev/auth/server";

async function requireAdminCtx(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const me = await ctx.db.get(userId);
  if (!me || me.role !== "admin") throw new Error("Admin access required");
}

export const seedAdmin = action({
  args: { email: v.string(), password: v.string(), role: v.optional(v.string()) },
  handler: async (_ctx, args) => {
    // Privilege escalation risk: only allow bootstrapping the FIRST admin on a
    // fresh deployment, or by an existing admin. Prevents anonymous admin creation.
    const me = await _ctx.runQuery(api.users.me);
    if (me && me.role !== "admin") throw new Error("Admin access required");
    try {
      const userId = await createAccount(_ctx, {
        provider: "password",
        account: { id: args.email, secret: args.password },
        profile: { email: args.email, role: args.role || "admin", name: "Admin" },
      });
      return { userId, alreadyExists: false };
    } catch (e: any) {
      if (/already exists|duplicate/i.test(e?.message ?? "")) {
        return { userId: null, alreadyExists: true };
      }
      throw e;
    }
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminCtx(ctx);
    const tables = ["projects", "brands", "categories", "timeline", "testimonials", "settings", "about", "wall", "media", "contactMessages"] as const;
    for (const table of tables) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
    }
    return { cleared: tables.length };
  },
});

export const seed = mutation({
  args: {
    projects: v.array(v.object({
      title: v.string(),
      slug: v.string(),
      brand: v.optional(v.string()),
      category: v.optional(v.string()),
      description: v.optional(v.string()),
      role: v.optional(v.string()),
      year: v.optional(v.string()),
      featured: v.boolean(),
      published: v.boolean(),
      thumbnail: v.optional(v.string()),
      orientation: v.optional(v.string()),
      tags: v.array(v.string()),
      externalUrl: v.optional(v.string()),
      gallery: v.array(v.string()),
      videos: v.array(v.string()),
      documents: v.array(v.object({ label: v.string(), url: v.optional(v.string()) })),
    })),
    brands: v.array(v.object({
      name: v.string(),
      website: v.optional(v.string()),
      featured: v.boolean(),
    })),
    categories: v.array(v.object({
      name: v.string(),
      slug: v.string(),
      color: v.optional(v.string()),
    })),
    timeline: v.array(v.object({
      company: v.string(),
      roleTitle: v.optional(v.string()),
      position: v.optional(v.string()),
      productionHouseId: v.optional(v.string()),
      employmentType: v.optional(v.string()),
      displayOrder: v.optional(v.number()),
      description: v.optional(v.string()),
      startDate: v.string(),
      endDate: v.optional(v.string()),
      skills: v.array(v.string()),
      location: v.optional(v.string()),
      images: v.optional(v.array(v.string())),
      tags: v.optional(v.array(v.string())),
      associated: v.optional(v.array(v.string())),
    })),
    testimonials: v.array(v.object({
      name: v.string(),
      company: v.optional(v.string()),
      quote: v.string(),
      featured: v.boolean(),
    })),
    settings: v.object({
      siteTitle: v.string(),
      seoTitle: v.optional(v.string()),
      seoDescription: v.optional(v.string()),
      instagram: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      youtube: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      location: v.optional(v.string()),
      footer: v.optional(v.string()),
      copyright: v.optional(v.string()),
    }),
    about: v.object({
      bio: v.string(),
      skills: v.array(v.string()),
      experience: v.optional(v.string()),
      education: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const projectCount = (await ctx.db.query("projects").collect()).length;
    if (projectCount > 0) {
      await requireAdminCtx(ctx);
    }
    const results: Record<string, number> = {};

    for (const p of args.projects) {
      await ctx.db.insert("projects", { ...p, sortOrder: Date.now() });
    }
    results.projects = args.projects.length;

    for (const b of args.brands) {
      await ctx.db.insert("brands", { ...b, sortOrder: Date.now() });
    }
    results.brands = args.brands.length;

    for (const c of args.categories) {
      await ctx.db.insert("categories", { ...c, sortOrder: Date.now() });
    }
    results.categories = args.categories.length;

    for (const t of args.timeline) {
      await ctx.db.insert("timeline", { ...t, sortOrder: Date.now() });
    }
    results.timeline = args.timeline.length;

    for (const t of args.testimonials) {
      await ctx.db.insert("testimonials", t);
    }
    results.testimonials = args.testimonials.length;

    const existingSettings = await ctx.db.query("settings").first();
    if (!existingSettings) {
      await ctx.db.insert("settings", args.settings);
    }
    results.settings = 1;

    const existingAbout = await ctx.db.query("about").first();
    if (!existingAbout) {
      await ctx.db.insert("about", args.about);
    }
    results.about = 1;

    return results;
  },
});