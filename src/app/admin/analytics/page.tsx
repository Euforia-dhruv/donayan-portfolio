"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Eye, MessageSquare } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Site traffic and engagement metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Page Views", value: "—", icon: Eye, desc: "Requires analytics integration" },
          { title: "Visitors", value: "—", icon: Users, desc: "Requires analytics integration" },
          { title: "Messages", value: "—", icon: MessageSquare, desc: "See Contact section" },
          { title: "Conversion", value: "—", icon: BarChart3, desc: "Requires analytics integration" },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Analytics / Plausible</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To enable analytics, add your tracking script to the root layout or configure it in the Settings page.
            You can integrate Google Analytics, Plausible, Umami, or any other analytics provider.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
