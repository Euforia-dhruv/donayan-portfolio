import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("timeline")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("timeline") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    company: v.string(),
    position: v.string(),
    description: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    skills: v.array(v.string()),
    location: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    associated: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const count = (await ctx.db.query("timeline").collect()).length;
    return await ctx.db.insert("timeline", { ...args, sortOrder: Date.now() + count });
  },
});

export const update = mutation({
  args: {
    id: v.id("timeline"),
    company: v.optional(v.string()),
    position: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    associated: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const reorder = mutation({
  args: { ids: v.array(v.id("timeline")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const base = Date.now();
    await Promise.all(
      args.ids.map((id, index) =>
        ctx.db.patch(id, { sortOrder: base + index })
      )
    );
    return { ok: true };
  },
});

export const remove = mutation({
  args: { id: v.id("timeline") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(args.id);
  },
});
