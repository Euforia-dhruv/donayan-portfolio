"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Settings {
  id: string;
  site_name: string;
  site_description: string;
  seo_title: string;
  seo_description: string;
  og_title: string;
  og_description: string;
  contact_email: string;
  social_links: Record<string, string>;
}

const defaults: Settings = {
  id: "",
  site_name: "Donayan",
  site_description: "Design, Photography & Creative Direction",
  seo_title: "Donayan — Portfolio",
  seo_description: "Design, Photography & Creative Direction",
  og_title: "Donayan",
  og_description: "Design, Photography & Creative Direction",
  contact_email: "",
  social_links: {},
};

export default function SettingsPage() {
  const [data, setData] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("settings").select("*").limit(1).single().then(({ data: item }) => {
      if (item) setData(item);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = {
      site_name: data.site_name,
      site_description: data.site_description,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      og_title: data.og_title,
      og_description: data.og_description,
      contact_email: data.contact_email,
      social_links: data.social_links,
    };

    if (data.id) {
      const { error } = await supabase.from("settings").update(payload).eq("id", data.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("settings").insert(payload).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
    }
    toast.success("Settings saved");
    setSaving(false);
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage site-wide configuration</p>
      </div>

      <Card>
        <CardHeader><CardTitle>General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input value={data.site_name} onChange={(e) => setData({ ...data, site_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Site Description</Label>
            <Input value={data.site_description} onChange={(e) => setData({ ...data, site_description: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input value={data.seo_title} onChange={(e) => setData({ ...data, seo_title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>SEO Description</Label>
            <Input value={data.seo_description} onChange={(e) => setData({ ...data, seo_description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>OG Title</Label>
            <Input value={data.og_title} onChange={(e) => setData({ ...data, og_title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>OG Description</Label>
            <Input value={data.og_description} onChange={(e) => setData({ ...data, og_description: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input type="email" value={data.contact_email} onChange={(e) => setData({ ...data, contact_email: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
    </div>
  );
}
