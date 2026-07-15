import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    let q = ctx.db.query("contactMessages");
    if (args.status !== undefined) q = q.filter((m) => m.eq(m.field("status"), args.status!));
    return await q.collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    const message = args.message.trim();
    if (!name || !message) throw new Error("Please complete all required fields.");
    if (!EMAIL_RE.test(email)) throw new Error("Please enter a valid email address.");
    if (message.length > 5000) throw new Error("Message is too long.");

    // Lightweight invisible rate limit: block the same email from submitting
    // again within 60 seconds (anti-spam / abuse).
    const recent = await ctx.db
      .query("contactMessages")
      .filter((m) => m.eq(m.field("email"), email))
      .collect();
    const cutoff = Date.now() - 60_000;
    if (recent.some((m) => (m._creationTime ?? 0) >= cutoff)) {
      throw new Error("Please wait a moment before sending another message.");
    }

    return await ctx.db.insert("contactMessages", {
      name,
      email,
      phone: args.phone,
      subject: args.subject,
      message,
      status: "unread",
    });
  },
});

export const markRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: "read" });
  },
});

export const remove = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
