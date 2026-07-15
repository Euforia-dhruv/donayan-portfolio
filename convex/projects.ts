import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { slugify } from "./lib/utils";

const projectFields = {
  title: v.string(),
  client: v.optional(v.string()),
  brand: v.optional(v.string()),
  campaign: v.optional(v.string()),
  category: v.optional(v.string()),
  description: v.optional(v.string()),
  role: v.optional(v.string()),
  year: v.optional(v.string()),
  featured: v.boolean(),
  published: v.boolean(),
  status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
  pinned: v.optional(v.boolean()),
  thumbnail: v.optional(v.string()),
  coverImage: v.optional(v.id("_storage")),
  gallery: v.array(v.string()),
  video: v.optional(v.string()),
  videos: v.array(v.string()),
  instagramUrl: v.optional(v.string()),
  youtubeUrl: v.optional(v.string()),
  externalUrl: v.optional(v.string()),
  orientation: v.optional(v.string()),
  aspectRatio: v.optional(v.string()),
  mediaType: v.optional(v.union(v.literal("image"), v.literal("video"), v.literal("mixed"))),
  autoThumbnail: v.optional(v.boolean()),
  tags: v.array(v.string()),
  credits: v.optional(v.array(v.string())),
  bts: v.optional(v.array(v.string())),
  metaDescription: v.optional(v.string()),
  keywords: v.array(v.string()),
  altText: v.optional(v.string()),
  slug: v.optional(v.string()),
  sortOrder: v.optional(v.number()),
};

const projectDoc = {
  ...projectFields,
  documents: v.array(v.object({ label: v.string(), fileId: v.optional(v.id("_storage")), url: v.optional(v.string()) })),
};

export const list = query({
  args: {
    published: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    category: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"), v.literal("mixed"))),
    brand: v.optional(v.string()),
    year: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("projects");
    if (args.published !== undefined) q = q.filter((p) => p.eq(p.field("published"), args.published!));
    if (args.featured !== undefined) q = q.filter((p) => p.eq(p.field("featured"), args.featured!));
    if (args.category !== undefined) q = q.filter((p) => p.eq(p.field("category"), args.category!));
    if (args.status !== undefined) q = q.filter((p) => p.eq(p.field("status"), args.status!));
    if (args.mediaType !== undefined) q = q.filter((p) => p.eq(p.field("mediaType"), args.mediaType!));
    if (args.brand !== undefined) q = q.filter((p) => p.eq(p.field("brand"), args.brand!));
    if (args.year !== undefined) q = q.filter((p) => p.eq(p.field("year"), args.year!));
    const items = await q.collect();
    return items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
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
  args: projectDoc,
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const slug = (args.slug && args.slug.trim()) || slugify(args.title);
    return await ctx.db.insert("projects", { ...args, slug, sortOrder: args.sortOrder ?? Date.now() });
  },
});

export const update = mutation({
  args: { id: v.id("projects"), ...projectFields, documents: v.optional(v.array(v.object({ label: v.string(), fileId: v.optional(v.id("_storage")), url: v.optional(v.string()) }))) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const { id, ...fields } = args;
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) clean[k] = v;
    }
    if (clean.slug && typeof clean.slug === "string" && clean.slug.trim()) clean.slug = clean.slug.trim();
    else if (clean.title) clean.slug = slugify(clean.title as string);
    await ctx.db.patch(id, clean);
  },
});

export const duplicate = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const src = await ctx.db.get(args.id);
    if (!src) throw new Error("Project not found");
    const { _id, _creationTime, ...rest } = src as Record<string, any>;
    return await ctx.db.insert("projects", {
      ...rest,
      title: `${src.title} (Copy)`,
      slug: slugify(`${src.title} copy ${Date.now()}`),
      published: false,
      status: "draft",
      featured: false,
      pinned: false,
      sortOrder: Date.now(),
    } as any);
  },
});

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("projects")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    for (const id of args.ids) await ctx.db.delete(id);
    return args.ids.length;
  },
});

export const bulkSetStatus = mutation({
  args: {
    ids: v.array(v.id("projects")),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    for (const id of args.ids) {
      const patch: Record<string, unknown> = { status: args.status };
      if (args.published !== undefined) patch.published = args.published;
      await ctx.db.patch(id, patch);
    }
    return args.ids.length;
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
