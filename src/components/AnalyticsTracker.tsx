"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GA_ID, trackGA } from "@/lib/gtag";
import { useTrack } from "@/lib/useTrack";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const track = useTrack();

  useEffect(() => {
    if (!GA_ID) return;
    trackGA("page_view", { page_path: pathname });
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cta = target.closest("[data-cta]") as HTMLElement | null;
      if (cta) {
        const label = cta.getAttribute("data-cta") || "cta";
        track("cta_click", { label });
        if (cta.hasAttribute("data-contact")) track("contact_submit", { label });
        return;
      }

      const a = target.closest("a") as HTMLAnchorElement | null;
      if (a && a.href) {
        const url = new URL(a.href, window.location.origin);
        if (url.origin !== window.location.origin) {
          track("outbound_link", {
            label: a.href,
            refTitle: a.textContent?.trim().slice(0, 80) || undefined,
          });
        }
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [track]);

  return null;
}
