import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { slugify } from "./lib/utils";

export const list = query({
  args: {
    published: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("projects");
    if (args.published !== undefined) q = q.filter((p) => p.eq(p.field("published"), args.published!));
    if (args.featured !== undefined) q = q.filter((p) => p.eq(p.field("featured"), args.featured!));
    if (args.category !== undefined) q = q.filter((p) => p.eq(p.field("category"), args.category!));
    return await q.collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("projects").filter((p) => p.eq(p.field("slug"), args.slug)).first();
  },
});

export const getById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    brand: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    role: v.optional(v.string()),
    year: v.optional(v.string()),
    featured: v.boolean(),
    published: v.boolean(),
    thumbnail: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    gallery: v.array(v.string()),
    videos: v.array(v.string()),
    documents: v.array(v.object({ label: v.string(), fileId: v.optional(v.id("_storage")), url: v.optional(v.string()) })),
    orientation: v.optional(v.string()),
    tags: v.array(v.string()),
    externalUrl: v.optional(v.string()),
    credits: v.optional(v.array(v.string())),
    bts: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const slug = (args.slug && args.slug.trim()) || slugify(args.title);
    return await ctx.db.insert("projects", { ...args, slug, sortOrder: args.sortOrder ?? Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    brand: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    role: v.optional(v.string()),
    year: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
    thumbnail: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    gallery: v.optional(v.array(v.string())),
    videos: v.optional(v.array(v.string())),
    documents: v.optional(v.array(v.object({ label: v.string(), fileId: v.optional(v.id("_storage")), url: v.optional(v.string()) }))),
    orientation: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    externalUrl: v.optional(v.string()),
    credits: v.optional(v.array(v.string())),
    bts: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const { id, ...fields } = args;
    if (fields.slug && fields.slug.trim()) (fields as any).slug = fields.slug.trim();
    else if (fields.title) (fields as any).slug = slugify(fields.title);
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(args.id);
  },
});
