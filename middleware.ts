import { NextRequest, NextResponse } from "next/server";

const SID = "d_analytics_sid";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Only track public, HTML page navigations (not admin, assets, or API).
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return res;
  }
  const accept = req.headers.get("accept") || "";
  if (!accept.includes("text/html")) return res;

  let sid = req.cookies.get(SID)?.value;
  if (!sid) {
    sid = crypto.randomUUID();
    res.cookies.set(SID, sid, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "";
  const referrer = req.headers.get("referer") || "";
  const ua = req.headers.get("user-agent") || "";
  const body = JSON.stringify({
    type: "page_view",
    path: pathname,
    referrer,
    ua,
    country,
    sessionId: sid,
  });

  // Fire-and-forget to the same-origin ingest route; never block the response.
  fetch(new URL("/api/analytics/ingest", req.url).toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).catch(() => {});
  return res;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|icon.svg|og.png|robots.txt|sitemap.xml|rss.xml|manifest.webmanifest).*)"],
};
