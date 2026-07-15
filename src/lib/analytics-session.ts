// Shared analytics session id. Prefers the cookie set by the Next.js
// middleware (server-side page views) and falls back to localStorage so
// client-side interaction events share the same session.
export function getAnalyticsSessionId(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)d_analytics_sid=([^;]+)/);
  if (m) return m[1];
  let sid = "";
  try {
    sid = localStorage.getItem("d_analytics_sid") || "";
  } catch {
    /* ignore */
  }
  if (!sid) {
    sid =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    try {
      localStorage.setItem("d_analytics_sid", sid);
    } catch {
      /* ignore */
    }
  }
  return sid;
}
