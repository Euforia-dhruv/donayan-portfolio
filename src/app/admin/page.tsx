"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Image, Mail, MessageSquare } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function AdminDashboard() {
  const projects = useQuery(api.projects.list, {});
  const wallItems = useQuery(api.wall.list, {});
  const media = useQuery(api.media.list, {});
  const messages = useQuery(api.contact.list, {});

  const stats = {
    projects: projects?.length ?? 0,
    wallItems: wallItems?.length ?? 0,
    media: media?.length ?? 0,
    messages: messages?.filter((m: any) => m.status === "unread")?.length ?? 0,
  };

  const cards = [
    { title: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
    { title: "Wall Items", value: stats.wallItems, icon: Image, href: "/admin/wall" },
    { title: "Media Files", value: stats.media, icon: Image, href: "/admin/media" },
    { title: "Unread Messages", value: stats.messages, icon: MessageSquare, href: "/admin/contact" },
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
