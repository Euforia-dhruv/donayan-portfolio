import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const list = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    let q = ctx.db.query("media");
    if (args.type !== undefined) q = q.filter((m) => m.eq(m.field("type"), args.type!));
    return await q.collect();
  },
});

export const listWithUrls = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const items = await ctx.db.query("media").collect();
    return await Promise.all(
      items.map(async (m) => ({
        ...m,
        url: await ctx.storage.getUrl(m.fileId),
      })),
    );
  },
});

export const getUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, { fileId }) => {
    return await ctx.storage.getUrl(fileId);
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    fileId: v.id("_storage"),
    type: v.string(),
    size: v.number(),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("media", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("media"),
    name: v.optional(v.string()),
    alt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("media") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const item = await ctx.db.get(args.id);
    if (!item) return;
    await ctx.storage.delete(item.fileId);
    await ctx.db.delete(args.id);
  },
});
