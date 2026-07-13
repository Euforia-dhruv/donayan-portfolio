import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { featured: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let q = ctx.db.query("testimonials");
    if (args.featured !== undefined) q = q.filter((t) => t.eq(t.field("featured"), args.featured!));
    return await q.collect();
  },
});

export const getById = query({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    company: v.optional(v.string()),
    quote: v.string(),
    image: v.optional(v.id("_storage")),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("testimonials", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("testimonials"),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    quote: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("testimonials") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(args.id);
  },
});
