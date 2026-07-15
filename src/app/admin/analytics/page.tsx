"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  Eye,
  MessageSquare,
  FileDown,
  ExternalLink,
  Play,
  Camera,
  MousePointerClick,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

type Dash = {
  total: number;
  pageViews: number;
  visitors: number;
  sessions: number;
  wallOpens: number;
  projectOpens: number;
  youtubePlays: number;
  instagramOpens: number;
  pdfDownloads: number;
  outbound: number;
  contactSubmits: number;
  topPages: { key: string; count: number }[];
  topProjects: { key: string; count: number }[];
  devices: { key: string; count: number }[];
  countries: { key: string; count: number }[];
  referrers: { key: string; count: number }[];
  ctaClicks: { key: string; count: number }[];
};

const fmt = (n: number) => n.toLocaleString("en-US");

function Stat({
  title,
  value,
  icon: Icon,
  hint,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gold/70" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

function BarList({
  title,
  icon: Icon,
  items,
  empty,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { key: string; count: number }[];
  empty: string;
}) {
  const max = items.reduce((m, i) => Math.max(m, i.count), 0) || 1;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4 text-gold/70" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>
        ) : (
          <ul className="space-y-2.5">
            {items.map((i) => (
              <li key={i.key} className="text-sm">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="truncate text-foreground/90" title={i.key}>
                    {i.key}
                  </span>
                  <span className="shrink-0 font-medium text-muted-foreground">{fmt(i.count)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                    style={{ width: `${Math.max(4, (i.count / max) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const data = useQuery(api.analytics.getDashboard) as Dash | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Real first-party traffic &amp; engagement. GA4 mirroring is active when configured.
        </p>
      </div>

      {data === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-8 w-24 animate-pulse rounded bg-white/5" />
                <div className="mt-3 h-3 w-16 animate-pulse rounded bg-white/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : data.total === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-lg font-medium">No analytics data yet</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Events will appear here automatically as visitors browse the site. Page views,
              opens, CTA clicks and downloads are tracked from the first visit.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat title="Total Visitors" value={fmt(data.visitors)} icon={Users} />
            <Stat title="Sessions" value={fmt(data.sessions)} icon={BarChart3} />
            <Stat title="Page Views" value={fmt(data.pageViews)} icon={Eye} />
            <Stat
              title="Messages"
              value={fmt(data.contactSubmits)}
              icon={MessageSquare}
              hint={`${fmt(data.wallOpens + data.projectOpens)} work opens`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <BarList
              title="Top Pages"
              icon={Globe}
              items={data.topPages}
              empty="No page views recorded yet."
            />
            <BarList
              title="Top Projects"
              icon={MousePointerClick}
              items={data.topProjects}
              empty="No project or wall opens yet."
            />
            <BarList
              title="Devices"
              icon={Smartphone}
              items={data.devices}
              empty="No device data yet."
            />
            <BarList
              title="Countries"
              icon={Globe}
              items={data.countries}
              empty="No country data yet."
            />
            <BarList
              title="Referrers"
              icon={ExternalLink}
              items={data.referrers}
              empty="No external referrers yet."
            />
            <BarList
              title="CTA Clicks"
              icon={MousePointerClick}
              items={data.ctaClicks}
              empty="No CTA clicks yet."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat title="YouTube Plays" value={fmt(data.youtubePlays)} icon={Play} />
            <Stat title="Instagram Opens" value={fmt(data.instagramOpens)} icon={Camera} />
            <Stat title="PDF Downloads" value={fmt(data.pdfDownloads)} icon={FileDown} />
            <Stat title="Outbound Links" value={fmt(data.outbound)} icon={ExternalLink} />
          </div>
        </>
      )}
    </div>
  );
}
