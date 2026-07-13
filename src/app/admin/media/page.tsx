"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: "image" | "video" | "document" | "other";
  size: number | null;
  alt_text: string | null;
  created_at: string;
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [form, setForm] = useState<{ name: string; url: string; alt_text: string; type: "image" | "video" | "document" | "other" }>({ name: "", url: "", alt_text: "", type: "image" });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchData = async () => {
    let query = supabase.from("media").select("*").order("created_at", { ascending: false });
    if (search) query = query.ilike("name", `%${search}%`);
    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", url: "", alt_text: "", type: "image" });
    setDialogOpen(true);
  };

  const openEdit = (item: MediaItem) => {
    setEditItem(item);
    setForm({ name: item.name, url: item.url, alt_text: item.alt_text ?? "", type: item.type });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.url.trim()) return toast.error("Name and URL are required");
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
      alt_text: form.alt_text.trim() || null,
      type: form.type,
    };

    if (editItem) {
      const { error } = await supabase.from("media").update(payload).eq("id", editItem.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Media updated");
    } else {
      const { error } = await supabase.from("media").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Media added");
    }
    setDialogOpen(false);
    setSaving(false);
    fetchData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("media").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Media deleted"); fetchData(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Uploaded images, videos, and documents</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Media</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No media files</TableCell></TableRow>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.type === "image" ? (
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
                        <Image src={item.url} alt={item.alt_text ?? item.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground uppercase">
                        {item.type.slice(0, 3)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{item.name}</TableCell>
                  <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">{item.type}</span></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatBytes(item.size)}</TableCell>
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
            <DialogTitle>{editItem ? "Edit Media" : "Add Media"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">File name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="hero-photo.jpg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select id="type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "image" | "video" | "document" | "other" })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="document">Document</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt">Alt text</Label>
                <Input id="alt" value={form.alt_text} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} />
              </div>
            </div>
            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? "Saving..." : editItem ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
