"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface AboutData {
  id: string;
  bio: string;
  photo_url: string | null;
  skills: string[];
  experience: string | null;
  email: string | null;
  social_links: Record<string, string>;
  resume_url: string | null;
}

const defaultAbout: AboutData = {
  id: "",
  bio: "",
  photo_url: "",
  skills: [],
  experience: "",
  email: "",
  social_links: {},
  resume_url: "",
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("about").select("*").limit(1).single().then(({ data: item }) => {
      if (item) setData(item);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = {
      bio: data.bio,
      photo_url: data.photo_url || null,
      skills: data.skills,
      experience: data.experience || null,
      email: data.email || null,
      social_links: data.social_links,
      resume_url: data.resume_url || null,
    };

    if (data.id) {
      const { error } = await supabase.from("about").update(payload).eq("id", data.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase.from("about").insert(payload).select().single();
      if (error) { toast.error(error.message); setSaving(false); return; }
    }
    toast.success("About page saved");
    setSaving(false);
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <p className="text-muted-foreground">Edit your about section</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" value={data.bio} onChange={(e) => setData({ ...data, bio: e.target.value })} rows={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input id="photo" value={data.photo_url ?? ""} onChange={(e) => setData({ ...data, photo_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Textarea id="experience" value={data.experience ?? ""} onChange={(e) => setData({ ...data, experience: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={data.email ?? ""} onChange={(e) => setData({ ...data, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Resume URL</Label>
            <Input id="resume" value={data.resume_url ?? ""} onChange={(e) => setData({ ...data, resume_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Skills (comma-separated)</Label>
            <Input value={data.skills.join(", ")} onChange={(e) => setData({ ...data, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} />
          </div>
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
