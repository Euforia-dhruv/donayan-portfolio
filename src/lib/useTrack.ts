"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { getAnalyticsSessionId } from "./analytics-session";
import { trackGA } from "./gtag";

type TrackProps = {
  path?: string;
  refId?: string;
  refTitle?: string;
  label?: string;
  referrer?: string;
};

/**
 * Track a first-party analytics event (stored in Convex) and mirror it to
 * GA4 when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.
 */
export function useTrack() {
  const insert = useMutation(api.analytics.insertEvent);
  return (type: string, props: TrackProps = {}) => {
    const sessionId = getAnalyticsSessionId();
    insert({
      type,
      sessionId,
      ua: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      referrer:
        typeof document !== "undefined" ? document.referrer || undefined : undefined,
      ...props,
    }).catch(() => {
      /* analytics must never break the UI */
    });
    trackGA(type, props);
  };
}
