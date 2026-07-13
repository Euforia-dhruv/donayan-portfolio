"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { formatDate, slugify } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string | null;
  thumbnail_url: string | null;
  images: string[];
  video_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Project | null>(null);
  const [form, setForm] = useState({ title: "", category: "", year: "", description: "", thumbnail_url: "", video_url: "", featured: false });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchData = async () => {
    let query = supabase.from("projects").select("*").order("sort_order", { ascending: true });
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: "", category: "", year: "", description: "", thumbnail_url: "", video_url: "", featured: false });
    setDialogOpen(true);
  };

  const openEdit = (item: Project) => {
    setEditItem(item);
    setForm({ title: item.title, category: item.category, year: item.year, description: item.description ?? "", thumbnail_url: item.thumbnail_url ?? "", video_url: item.video_url ?? "", featured: item.featured });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    const slug = slugify(form.title);
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order ?? 0)) : 0;
    const payload: any = {
      title: form.title.trim(),
      slug,
      category: form.category,
      year: form.year,
      description: form.description.trim() || null,
      thumbnail_url: form.thumbnail_url.trim() || null,
      video_url: form.video_url.trim() || null,
      featured: form.featured,
      sort_order: editItem?.sort_order ?? maxOrder + 1,
    };

    if (editItem) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editItem.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Project updated");
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Project created");
    }
    setDialogOpen(false);
    setSaving(false);
    fetchData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Project deleted"); fetchData(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Project</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No projects found</TableCell></TableRow>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" /></TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded">{item.category}</span></TableCell>
                  <TableCell className="text-muted-foreground">{item.year}</TableCell>
                  <TableCell>{item.featured ? <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Featured</span> : "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatDate(item.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumb">Thumbnail URL</Label>
              <Input id="thumb" value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Video URL</Label>
              <Input id="video" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/..." />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300" />
              <span className="text-sm">Featured project</span>
            </label>
            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? "Saving..." : editItem ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
