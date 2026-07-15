"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ViewTracker() {
  const pathname = usePathname();
  const trackView = useMutation(api.analytics.trackView);

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;
    trackView().catch(() => {});
  }, [pathname, trackView]);

  return null;
}
