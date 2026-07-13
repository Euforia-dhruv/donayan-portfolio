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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export default function TimelinePage() {
  const items = useQuery(api.timeline.list) ?? [];
  const create = useMutation(api.timeline.create);
  const update = useMutation(api.timeline.update);
  const remove = useMutation(api.timeline.remove);
  const reorder = useMutation(api.timeline.reorder);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({
    company: "", position: "", startDate: "", endDate: "", description: "",
    skills: "", location: "", images: "", tags: "", associated: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (items !== undefined) setLoading(false); }, [items]);

  const filtered = search
    ? items.filter((i: any) => i.company?.toLowerCase().includes(search.toLowerCase()))
    : items;

  const openCreate = () => {
    setEditItem(null);
    setForm({ company: "", position: "", startDate: "", endDate: "", description: "", skills: "", location: "", images: "", tags: "", associated: "" });
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      company: item.company, position: item.position,
      startDate: item.startDate, endDate: item.endDate ?? "",
      description: item.description ?? "", skills: (item.skills ?? []).join(", "),
      location: item.location ?? "",
      images: (item.images ?? []).join(", "),
      tags: (item.tags ?? []).join(", "),
      associated: (item.associated ?? []).join(", "),
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.company.trim() || !form.position.trim()) return toast.error("Company and position are required");
    setSaving(true);
    try {
      const payload: any = {
        company: form.company.trim(),
        position: form.position.trim(),
        startDate: form.startDate,
        endDate: form.endDate.trim() || undefined,
        description: form.description.trim() || undefined,
        skills: form.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
        location: form.location.trim() || undefined,
        images: form.images.split(",").map((s: string) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
        associated: form.associated.split(",").map((s: string) => s.trim()).filter(Boolean),
      };

      if (editItem) {
        await update({ id: editItem._id, ...payload });
        toast.success("Timeline entry updated");
      } else {
        await create(payload);
        toast.success("Timeline entry created");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
    setSaving(false);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= filtered.length) return;
    const reordered = [...filtered];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    try {
      await reorder({ ids: reordered.map((i: any) => i._id) });
      toast.success("Reordered");
    } catch (err: any) {
      toast.error(err.message || "Failed to reorder");
    }
  };

  const doRemove = async (id: Id<"timeline">) => {
    try {
      await remove({ id });
      toast.success("Timeline entry deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
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
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No timeline entries</TableCell></TableRow>
              ) :                 filtered.map((item: any, index: number) => (
                <TableRow key={item._id}>
                  <TableCell><GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" /></TableCell>
                  <TableCell className="font-medium">{item.company}</TableCell>
                  <TableCell className="text-muted-foreground">{item.position}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{item.startDate}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{item.endDate || "Present"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up"><span className="text-sm">↑</span></Button>
                      <Button variant="ghost" size="icon" onClick={() => move(index, 1)} disabled={index === filtered.length - 1} aria-label="Move down"><span className="text-sm">↓</span></Button>
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
            <DialogTitle>{editItem ? "Edit Timeline Entry" : "Add Timeline Entry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Twism" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Director's Assistant" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="text" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="2024-01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="text" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="2024-06 or leave empty" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Mumbai, India" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="production, coordination" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="advertising, fashion" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="associated">Associated (companies/projects, comma-separated)</Label>
              <Input id="associated" value={form.associated} onChange={(e) => setForm({ ...form, associated: e.target.value })} placeholder="Brand X, Project Y" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Image URLs (comma-separated)</Label>
              <Input id="images" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://.../img.jpg" />
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
