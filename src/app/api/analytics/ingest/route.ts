import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const runtime = "nodejs";

// Server-side analytics ingest. Called by the Next.js middleware (which has
// accurate country/device/referrer headers). insertEvent is a public mutation.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    await client.mutation(api.analytics.insertEvent, {
      type: body.type as string,
      path: body.path as string | undefined,
      refId: body.refId as string | undefined,
      refTitle: body.refTitle as string | undefined,
      label: body.label as string | undefined,
      referrer: body.referrer as string | undefined,
      ua: body.ua as string | undefined,
      country: body.country as string | undefined,
      sessionId: body.sessionId as string | undefined,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
