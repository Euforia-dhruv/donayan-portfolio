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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { formatDate, slugify } from "@/lib/utils";

interface WallItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  orientation: "portrait" | "landscape" | "square";
  sort_order: number;
  created_at: string;
}

export default function WallPage() {
  const [items, setItems] = useState<WallItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<WallItem | null>(null);
  const [form, setForm] = useState<{ title: string; description: string; image_url: string; category: string; orientation: "portrait" | "landscape" | "square" }>({ title: "", description: "", image_url: "", category: "", orientation: "landscape" });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchData = async () => {
    let query = supabase.from("wall_items").select("*").order("sort_order", { ascending: true });
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: "", description: "", image_url: "", category: "", orientation: "landscape" });
    setDialogOpen(true);
  };

  const openEdit = (item: WallItem) => {
    setEditItem(item);
    setForm({ title: item.title, description: item.description ?? "", image_url: item.image_url, category: item.category ?? "", orientation: item.orientation });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.image_url.trim()) return toast.error("Title and image URL are required");
    setSaving(true);
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order ?? 0)) : 0;
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_url: form.image_url.trim(),
      category: form.category.trim() || null,
      orientation: form.orientation,
      sort_order: editItem?.sort_order ?? maxOrder + 1,
    };

    if (editItem) {
      const { error } = await supabase.from("wall_items").update(payload).eq("id", editItem.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Wall item updated");
    } else {
      const { error } = await supabase.from("wall_items").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Wall item created");
    }
    setDialogOpen(false);
    setSaving(false);
    fetchData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("wall_items").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Wall item deleted"); fetchData(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wall</h1>
          <p className="text-muted-foreground">Manage the production wall gallery</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Item</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search wall items..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Orientation</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No wall items</TableCell></TableRow>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" /></TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded">{item.category || "—"}</span></TableCell>
                  <TableCell className="text-muted-foreground capitalize">{item.orientation}</TableCell>
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
            <DialogTitle>{editItem ? "Edit Wall Item" : "Add Wall Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat">Category</Label>
                <Input id="cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <select id="orientation" value={form.orientation} onChange={(e) => setForm({ ...form, orientation: e.target.value as "portrait" | "landscape" | "square" })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>
            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? "Saving..." : editItem ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
