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
import { Plus, Pencil, Trash2, Search, Upload, Copy } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useConvexUpload } from "@/lib/convex/upload";

function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function isImage(type: string | undefined) {
  return !!type && type.startsWith("image/");
}

export default function MediaPage() {
  const items = useQuery(api.media.listWithUrls, {}) ?? [];
  const create = useMutation(api.media.create);
  const update = useMutation(api.media.update);
  const remove = useMutation(api.media.remove);
  const upload = useConvexUpload();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState<{ name: string; alt: string }>({ name: "", alt: "" });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (items !== undefined) setLoading(false); }, [items]);

  const filtered = search
    ? items.filter((i: any) => i.name?.toLowerCase().includes(search.toLowerCase()))
    : items;

  const openCreate = () => {
    setEditItem(null);
    setForm({ name: "", alt: "" });
    setFile(null);
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({ name: item.name, alt: item.alt ?? "" });
    setFile(null);
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("File name is required");
    setSaving(true);
    try {
      if (editItem) {
        await update({ id: editItem._id, name: form.name.trim(), alt: form.alt.trim() || undefined });
        toast.success("Media updated");
      } else {
        if (!file) return toast.error("Please choose a file to upload");
        const { storageId, url } = await upload(file);
        await create({
          name: form.name.trim(),
          fileId: storageId as Id<"_storage">,
          type: file.type || "application/octet-stream",
          size: file.size,
          alt: form.alt.trim() || undefined,
        });
        toast.success("Uploaded to Convex Storage");
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
    setSaving(false);
  };

  const doRemove = async (id: Id<"media">) => {
    if (!window.confirm("Delete this media file? This cannot be undone.")) return;
    try {
      await remove({ id });
      toast.success("Media deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">All uploaded assets live in Convex File Storage</p>
        </div>
        <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Upload Media</Button>
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
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No media files</TableCell></TableRow>
              ) : filtered.map((item: any) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {isImage(item.type) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.alt ?? item.name} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{item.type?.split("/")[1] ?? "file"}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[220px] truncate">{item.name}</TableCell>
                  <TableCell><span className="text-xs bg-muted px-2 py-0.5 rounded capitalize">{item.type}</span></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatBytes(item.size)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => copyUrl(item.url)} aria-label="Copy URL"><Copy className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => doRemove(item._id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
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
            <DialogTitle>{editItem ? "Edit Media" : "Upload Media"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!editItem && (
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <input
                  id="file"
                  type="file"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                    if (f && !form.name) setForm((s) => ({ ...s, name: f.name }));
                  }}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-primary-foreground"
                />
              </div>
            )}
              <div className="space-y-2">
                <Label htmlFor="fileName">File name</Label>
                <Input id="fileName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Alt text</Label>
              <Input id="alt" value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} />
            </div>
            <Button onClick={save} disabled={saving} className="w-full">
              {saving ? "Saving..." : editItem ? "Update" : <><Upload className="mr-2 h-4 w-4" />Upload to Storage</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
