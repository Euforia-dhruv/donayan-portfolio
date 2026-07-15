"use client";

// Server-side page views (with accurate country/device/referrer) are now
// recorded by the Next.js middleware. This component is kept as a harmless
// mount point; client-side interaction/CTA/outbound tracking lives in
// AnalyticsTracker.
export default function ViewTracker() {
  return null;
}
