import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Require an authenticated user. Returns the user id or throws.
 * Use for any mutation/query that should not be callable anonymously.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx): Promise<string> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
}

/**
 * Require an authenticated admin (role === "admin").
 * Convex functions are callable directly by any client that knows the
 * deployment URL, so authorization MUST be enforced server-side here and
 * not only in the UI. Throws a generic error for non-admins.
 */
export async function requireAdmin(
  ctx: QueryCtx | MutationCtx,
): Promise<{ _id: string; role?: string }> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const user = await ctx.db.get(userId);
  if (!user || user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
}
