import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("about").first();
  },
});

export const upsert = mutation({
  args: {
    bio: v.string(),
    resume: v.optional(v.id("_storage")),
    skills: v.array(v.string()),
    experience: v.optional(v.string()),
    education: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const existing = await ctx.db.query("about").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("about", args);
    }
  },
});
