"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function SettingsPage() {
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteTitle: "Donayan Sahdev",
    seoTitle: "",
    seoDescription: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    email: "",
    phone: "",
    location: "",
    footer: "",
    copyright: "",
  });

  useEffect(() => {
    if (settings !== undefined) {
      setForm({
        siteTitle: settings?.siteTitle ?? "Donayan Sahdev",
        seoTitle: settings?.seoTitle ?? "",
        seoDescription: settings?.seoDescription ?? "",
        instagram: settings?.instagram ?? "",
        linkedin: settings?.linkedin ?? "",
        youtube: settings?.youtube ?? "",
        email: settings?.email ?? "",
        phone: settings?.phone ?? "",
        location: settings?.location ?? "",
        footer: settings?.footer ?? "",
        copyright: settings?.copyright ?? "",
      });
      setLoading(false);
    }
  }, [settings]);

  const save = async () => {
    setSaving(true);
    try {
      await upsert({
        siteTitle: form.siteTitle,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        instagram: form.instagram || undefined,
        linkedin: form.linkedin || undefined,
        youtube: form.youtube || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        location: form.location || undefined,
        footer: form.footer || undefined,
        copyright: form.copyright || undefined,
      });
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
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
            <Label>Site Title</Label>
            <Input value={form.siteTitle} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Footer Text</Label>
            <Input value={form.footer} onChange={(e) => setForm({ ...form, footer: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Copyright</Label>
            <Input value={form.copyright} onChange={(e) => setForm({ ...form, copyright: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>SEO Description</Label>
            <Input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact & Social</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
    </div>
  );
}
