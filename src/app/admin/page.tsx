"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Image, Mail, MessageSquare } from "lucide-react";

interface Stats {
  projects: number;
  wallItems: number;
  media: number;
  messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, wallItems: 0, media: 0, messages: 0 });
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      const [projects, wallItems, media, messages] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("wall_items").select("*", { count: "exact", head: true }),
        supabase.from("media").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        projects: projects.count ?? 0,
        wallItems: wallItems.count ?? 0,
        media: media.count ?? 0,
        messages: messages.count ?? 0,
      });
    }
    loadStats();
  }, []);

  const cards = [
    { title: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
    { title: "Wall Items", value: stats.wallItems, icon: Image, href: "/admin/wall" },
    { title: "Media Files", value: stats.media, icon: Image, href: "/admin/media" },
    { title: "Messages", value: stats.messages, icon: MessageSquare, href: "/admin/contact" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
