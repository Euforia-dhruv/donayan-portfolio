"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function AboutPage() {
  const aboutData = useQuery(api.about.get);
  const upsert = useMutation(api.about.upsert);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ bio: "", skills: "", experience: "", education: "" });

  useEffect(() => {
    if (aboutData !== undefined) {
      setForm({
        bio: aboutData?.bio ?? "",
        skills: (aboutData?.skills ?? []).join(", "),
        experience: aboutData?.experience ?? "",
        education: aboutData?.education ?? "",
      });
      setLoading(false);
    }
  }, [aboutData]);

  const save = async () => {
    setSaving(true);
    try {
      await upsert({
        bio: form.bio,
        skills: form.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
        experience: form.experience.trim() || undefined,
        education: form.education.trim() || undefined,
      });
      toast.success("About page saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
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
            <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Experience details</Label>
            <Textarea id="experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Textarea id="education" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Skills (comma-separated)</Label>
            <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </div>
          <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
