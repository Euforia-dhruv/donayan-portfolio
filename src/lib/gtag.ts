export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Mirror a first-party analytics event to Google Analytics 4 (if configured).
export function trackGA(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !GA_ID || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("event", event, params);
}
