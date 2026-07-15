import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const trackView = mutation({
  args: {},
  handler: async (ctx) => {
    const date = new Date().toISOString().slice(0, 10);
    const existing = await ctx.db
      .query("pageViews")
      .withIndex("by_date", (q) => q.eq("date", date))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { count: existing.count + 1 });
    } else {
      await ctx.db.insert("pageViews", { date, count: 1 });
    }
  },
});
