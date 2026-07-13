"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function WallPage() {
  const items = useQuery(api.wall.list, {}) ?? [];
  const create = useMutation(api.wall.create);
  const update = useMutation(api.wall.update);
  const remove = useMutation(api.wall.remove);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<{ video: string; featured: boolean; published: boolean }>({ video: "", featured: false, published: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (items !== undefined) setLoading(false); }, [items]);

  const filtered = search
    ? items.filter((i: any) => i._id?.includes(search) || String(i.x)?.includes(search))
    : items;

  const openCreate = () => {
    setEditItem(null);
    setForm({ video: "", featured: false, published: true });
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({ video: item.video ?? "", featured: item.featured, published: item.published });
    setDialogOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload: any = {
        video: form.video.trim() || undefined,
        featured: form.featured,
        published: form.published,
      };

      if (editItem) {
        await update({ id: editItem._id, ...payload });
        toast.success("Wall item updated");
      } else {
        await create(payload);
        toast.success("Wall item created");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
    setSaving(false);
  };

  const doRemove = async (id: Id<"wall">) => {
    try {
      await remove({ id });
      toast.success("Wall item deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
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
                <TableHead>ID</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No wall items</TableCell></TableRow>
              ) : filtered.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell><GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" /></TableCell>
                  <TableCell className="font-medium text-xs font-mono">{item._id.slice(0, 12)}...</TableCell>
                  <TableCell>{item.featured ? <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Featured</span> : "—"}</TableCell>
                  <TableCell>{item.published ? <span className="text-xs text-green-500">Yes</span> : "No"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => doRemove(item._id)}><Trash2 className="h-4 w-4" /></Button>
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
              <Label htmlFor="video">Video URL</Label>
              <Input id="video" value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} placeholder="https://youtube.com/..." />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300" />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-300" />
              <span className="text-sm">Published</span>
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
