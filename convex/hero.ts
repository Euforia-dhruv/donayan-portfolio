import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const get = query({
  handler: async (ctx) => {
    const doc = await ctx.db.query("hero").first();
    if (!doc) return null;
    const bgPhotoUrl = doc.bgPhotoId ? await ctx.storage.getUrl(doc.bgPhotoId) : null;
    const bgVideoUrl = doc.bgVideoId ? await ctx.storage.getUrl(doc.bgVideoId) : null;
    return { ...doc, bgPhotoUrl, bgVideoUrl };
  },
});

export const update = mutation({
  args: {
    bgPhotoId: v.optional(v.id("_storage")),
    bgVideoId: v.optional(v.id("_storage")),
    headline: v.optional(v.string()),
    freelance: v.optional(v.string()),
    role1: v.optional(v.string()),
    role2: v.optional(v.string()),
    description: v.optional(v.string()),
    ctaPrimary: v.optional(v.string()),
    ctaSecondary: v.optional(v.string()),
    stats: v.optional(v.array(v.object({ value: v.string(), label: v.string() }))),
    availableFor: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db.query("hero").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("hero", args);
  },
});

export const removeMedia = mutation({
  args: { kind: v.union(v.literal("photo"), v.literal("video")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db.query("hero").first();
    if (!doc) return;
    if (args.kind === "photo" && doc.bgPhotoId) {
      await ctx.storage.delete(doc.bgPhotoId);
      await ctx.db.patch(doc._id, { bgPhotoId: undefined });
    }
    if (args.kind === "video" && doc.bgVideoId) {
      await ctx.storage.delete(doc.bgVideoId);
      await ctx.db.patch(doc._id, { bgVideoId: undefined });
    }
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
