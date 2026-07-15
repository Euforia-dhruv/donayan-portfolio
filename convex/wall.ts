import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

export const list = query({
  args: { published: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("wall");
    if (args.published !== undefined) q = q.filter((w) => w.eq(w.field("published"), args.published!));
    return await q.collect();
  },
});

export const getById = query({
  args: { id: v.id("wall") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    projectId: v.optional(v.id("projects")),
    image: v.optional(v.id("_storage")),
    video: v.optional(v.string()),
    rotation: v.optional(v.number()),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    zIndex: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    featured: v.boolean(),
    published: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("wall", { ...args, sortOrder: Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("wall"),
    projectId: v.optional(v.id("projects")),
    image: v.optional(v.id("_storage")),
    video: v.optional(v.string()),
    rotation: v.optional(v.number()),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    zIndex: v.optional(v.number()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    featured: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("wall") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
