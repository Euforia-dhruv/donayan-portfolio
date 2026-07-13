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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useConvexUpload } from "@/lib/convex/upload";

const emptyForm = {
  title: "", slug: "", brand: "", category: "", role: "", year: "",
  orientation: "landscape", description: "", externalUrl: "",
  gallery: "", videos: "", documents: "",   credits: "", bts: "", tags: "",
  sortOrder: "",
  featured: false, published: true,
};

export default function ProjectsPage() {
  const items = useQuery(api.projects.list, {}) ?? [];
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);
  const upload = useConvexUpload();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbUrl, setThumbUrl] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (items !== undefined) setLoading(false); }, [items]);

  const filtered = search
    ? items.filter((i: any) => i.title?.toLowerCase().includes(search.toLowerCase()))
    : items;

  const resetFiles = () => { setThumbFile(null); setThumbUrl(""); setPosterFile(null); setPosterUrl(""); };

  const openCreate = () => {
    setEditItem(null);
    setForm({ ...emptyForm });
    resetFiles();
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({
      title: item.title, slug: item.slug ?? "", brand: item.brand ?? "", category: item.category ?? "",
      role: item.role ?? "", year: item.year ?? "", orientation: item.orientation ?? "landscape",
      description: item.description ?? "", externalUrl: item.externalUrl ?? "",
      gallery: (item.gallery ?? []).join(", "), videos: (item.videos ?? []).join(", "),
      documents: (item.documents ?? []).map((d: any) => `${d.label}${d.url ? "|" + d.url : ""}`).join(", "),
      credits: (item.credits ?? []).join(", "), bts: (item.bts ?? []).join(", "),
      tags: (item.tags ?? []).join(", "), sortOrder: item.sortOrder ? String(item.sortOrder) : "",
      featured: item.featured, published: item.published,
    });
    setThumbFile(null); setThumbUrl(item.thumbnail ?? "");
    setPosterFile(null); setPosterUrl(item.coverImage ? `storage:${item.coverImage}` : "");
    setDialogOpen(true);
  };

  const toArray = (s: string) =>
    s.split(",").map((x) => x.trim()).filter(Boolean);

  const parseDocuments = (s: string) =>
    toArray(s).map((entry) => {
      const [label, url] = entry.split("|").map((x) => x.trim());
      return { label: label || url || "Document", url: url || undefined };
    });

  const save = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      let thumbnail = thumbUrl || editItem?.thumbnail || undefined;
      if (thumbFile) thumbnail = (await upload(thumbFile)).url;
      let coverImage = editItem?.coverImage || undefined;
      if (posterFile) coverImage = (await upload(posterFile)).storageId;
      else if (posterUrl.startsWith("storage:")) coverImage = posterUrl.slice(8) as Id<"_storage">;
      else if (!posterUrl) coverImage = undefined;

      const base: any = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        brand: form.brand.trim() || undefined,
        category: form.category.trim() || undefined,
        role: form.role.trim() || undefined,
        year: form.year.trim() || undefined,
        orientation: form.orientation || undefined,
        description: form.description.trim() || undefined,
        externalUrl: form.externalUrl.trim() || undefined,
        gallery: toArray(form.gallery),
        videos: toArray(form.videos),
        documents: parseDocuments(form.documents),
        credits: toArray(form.credits),
        bts: toArray(form.bts),
        tags: toArray(form.tags),
        thumbnail,
        coverImage,
        featured: form.featured,
        published: form.published,
        sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
      };

      if (editItem) {
        await update({ id: editItem._id, ...base });
        toast.success("Project updated");
      } else {
        await create(base);
        toast.success("Project created");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
    setSaving(false);
  };

  const doRemove = async (id: Id<"projects">) => {
    try {
      await remove({ id });
      toast.success("Project deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
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
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No projects found</TableCell></TableRow>
              ) : filtered.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded">{item.category || "—"}</span></TableCell>
                  <TableCell className="text-muted-foreground">{item.year}</TableCell>
                  <TableCell>{item.featured ? <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Featured</span> : "—"}</TableCell>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input id="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from title" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumb">Thumbnail (upload or URL)</Label>
              {thumbUrl && !thumbUrl.startsWith("storage:") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbUrl} alt="thumbnail preview" className="h-24 w-40 object-cover rounded border" />
              )}
              <input
                id="thumb" type="file" accept="image/*"
                onChange={(e) => { setThumbFile(e.target.files?.[0] ?? null); }}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
              />
              <Input placeholder="…or paste an external image URL" value={thumbUrl.startsWith("storage:") ? "" : thumbUrl} onChange={(e) => { setThumbUrl(e.target.value); setThumbFile(null); }} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poster">Poster / Cover Image (upload or URL)</Label>
              <input
                id="poster" type="file" accept="image/*"
                onChange={(e) => { setPosterFile(e.target.files?.[0] ?? null); }}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
              />
              <Input placeholder="…or paste an external image URL" value={posterUrl.startsWith("storage:") ? "" : posterUrl} onChange={(e) => { setPosterUrl(e.target.value); setPosterFile(null); }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <select id="orientation" value={form.orientation} onChange={(e) => setForm({ ...form, orientation: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                  <option value="square">Square</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="externalUrl">External URL (Instagram / YouTube / Behance)</Label>
              <Input id="externalUrl" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery">Gallery image URLs (comma-separated)</Label>
              <Textarea id="gallery" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} rows={2} placeholder="https://.../1.jpg, https://.../2.jpg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videos">Video URLs (comma-separated)</Label>
              <Textarea id="videos" value={form.videos} onChange={(e) => setForm({ ...form, videos: e.target.value })} rows={2} placeholder="https://.../clip.mp4, https://youtu.be/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documents">Documents / PDFs (Label|url, comma-separated)</Label>
              <Textarea id="documents" value={form.documents} onChange={(e) => setForm({ ...form, documents: e.target.value })} rows={2} placeholder="Contract|https://.../c.pdf, Lookbook|https://.../l.pdf" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits (comma-separated)</Label>
              <Input id="credits" value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })} placeholder="Director: X, DOP: Y" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bts">Behind-the-scenes image URLs (comma-separated)</Label>
              <Textarea id="bts" value={form.bts} onChange={(e) => setForm({ ...form, bts: e.target.value })} rows={2} placeholder="https://.../bts1.jpg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="commercial, fashion" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort order (lower shows first)</Label>
              <Input id="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm">Published</span>
              </label>
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
