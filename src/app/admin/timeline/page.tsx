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
import { formatDate } from "@/lib/utils";

interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string | null;
  date: string;
  description: string | null;
  media_url: string | null;
  sort_order: number;
  created_at: string;
}

export default function TimelinePage() {
  const [items, setItems] = useState<TimelineEntry[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<TimelineEntry | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", date: "", description: "", media_url: "" });
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchData = async () => {
    let query = supabase.from("timeline_entries").select("*").order("sort_order", { ascending: true });
    if (search) query = query.ilike("title", `%${search}%`);
    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [search]);

  const openCreate = () => {
    setEditItem(null);
    setForm({ title: "", subtitle: "", date: "", description: "", media_url: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: TimelineEntry) => {
    setEditItem(item);
    setForm({ title: item.title, subtitle: item.subtitle ?? "", date: item.date, description: item.description ?? "", media_url: item.media_url ?? "" });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.date.trim()) return toast.error("Title and date are required");
    setSaving(true);
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order ?? 0)) : 0;
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      date: form.date,
      description: form.description.trim() || null,
      media_url: form.media_url.trim() || null,
      sort_order: editItem?.sort_order ?? maxOrder + 1,
    };

    if (editItem) {
      const { error } = await supabase.from("timeline_entries").update(payload).eq("id", editItem.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Timeline entry updated");
    } else {
      const { error } = await supabase.from("timeline_entries").insert(payload);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Timeline entry created");
    }
    setDialogOpen(false);
    setSaving(false);
    fetchData();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("timeline_entries").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Timeline entry deleted"); fetchData(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
          <p className="text-muted-foreground">Manage your production timeline</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Entry</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search timeline..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No timeline entries</TableCell></TableRow>
              ) : items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" /></TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{item.date}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">{item.subtitle || "—"}</TableCell>
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
            <DialogTitle>{editItem ? "Edit Timeline Entry" : "Add Timeline Entry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project Launch" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input id="subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Role / client" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="media">Media URL (optional)</Label>
              <Input id="media" value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} placeholder="https://..." />
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
