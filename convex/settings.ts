import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("settings").first();
  },
});

export const upsert = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.query("settings").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("settings", args);
    }
  },
});
