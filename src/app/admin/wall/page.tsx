"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Copy,
  MoreHorizontal,
  LayoutGrid,
  Rows3,
  Columns3,
  Star,
  Pin,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  X,
  GripVertical,
  Loader2,
} from "lucide-react";

type Project = any;
type Status = "draft" | "published" | "archived";

const splitList = (s: string) =>
  s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean);

const joinList = (a?: string[]) => (a ?? []).join(", ");

function StatusBadge({ status }: { status?: Status }) {
  const map: Record<Status, string> = {
    draft: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    published: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
    archived: "bg-white/10 text-muted-foreground ring-white/20",
  };
  const val = (status ?? "draft") as Status;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1",
        map[val],
      )}
    >
      {val}
    </span>
  );
}

const emptyForm = {
  title: "",
  slug: "",
  client: "",
  brand: "",
  campaign: "",
  category: "",
  description: "",
  role: "",
  year: "",
  featured: false,
  published: true,
  status: "draft" as Status,
  pinned: false,
  thumbnail: "",
  video: "",
  instagramUrl: "",
  youtubeUrl: "",
  externalUrl: "",
  orientation: "",
  aspectRatio: "",
  mediaType: "" as "" | "image" | "video" | "mixed",
  autoThumbnail: false,
  gallery: "",
  videos: "",
  tags: "",
  credits: "",
  bts: "",
  metaDescription: "",
  keywords: "",
  altText: "",
  sortOrder: "",
  documents: [] as { label: string; url: string }[],
};

export default function WallAdminPage() {
  const projects = useQuery(api.projects.list, {}) ?? [];
  const create = useMutation(api.projects.create);
  const update = useMutation(api.projects.update);
  const remove = useMutation(api.projects.remove);
  const duplicate = useMutation(api.projects.duplicate);
  const bulkRemove = useMutation(api.projects.bulkRemove);
  const bulkSetStatus = useMutation(api.projects.bulkSetStatus);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [mediaFilter, setMediaFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [view, setView] = React.useState<"table" | "grid" | "masonry">("table");
  const [sort, setSort] = React.useState<"manual" | "newest" | "title">("manual");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Project | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  const categories = React.useMemo(
    () => Array.from(new Set(projects.map((p: Project) => p.category).filter(Boolean))).sort(),
    [projects],
  );

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = projects.filter((p: Project) => {
      if (statusFilter !== "all" && (p.status ?? "draft") !== statusFilter) return false;
      if (mediaFilter !== "all" && (p.mediaType ?? "") !== mediaFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (q) {
        const hay = `${p.title} ${p.client ?? ""} ${p.brand ?? ""} ${p.category ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "title") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "newest") list = [...list].sort((a, b) => (b.sortOrder ?? 0) - (a.sortOrder ?? 0));
    else list = [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return list;
  }, [projects, search, statusFilter, mediaFilter, categoryFilter, sort]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((p: Project) => selected.has(p._id));

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) filtered.forEach((p: Project) => next.delete(p._id));
      else filtered.forEach((p: Project) => next.add(p._id));
      return next;
    });
  };

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setEditorOpen(true);
  };

  const doDuplicate = async (id: Id<"projects">) => {
    try {
      await duplicate({ id });
      toast.success("Project duplicated");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to duplicate");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await remove({ id: deleteTarget._id });
      toast.success("Project deleted");
      setSelected((s) => {
        const n = new Set(s);
        n.delete(deleteTarget._id);
        return n;
      });
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete");
    }
    setDeleteTarget(null);
  };

  const applyBulkStatus = async (status: Status, published?: boolean) => {
    const ids = Array.from(selected) as Id<"projects">[];
    try {
      await bulkSetStatus({ ids, status, published });
      toast.success(`${ids.length} projects updated`);
      setSelected(new Set());
    } catch (e: any) {
      toast.error(e.message ?? "Bulk update failed");
    }
  };

  const confirmBulkDelete = async () => {
    const ids = Array.from(selected) as Id<"projects">[];
    try {
      await bulkRemove({ ids });
      toast.success(`${ids.length} projects deleted`);
      setSelected(new Set());
    } catch (e: any) {
      toast.error(e.message ?? "Bulk delete failed");
    }
    setBulkDeleteOpen(false);
  };

  const hasFilters =
    statusFilter !== "all" || mediaFilter !== "all" || categoryFilter !== "all" || search !== "";

  const clearFilters = () => {
    setStatusFilter("all");
    setMediaFilter("all");
    setCategoryFilter("all");
    setSearch("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Production Wall</h1>
            <Badge className="bg-white/5">
              {projects.length}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Curate the cinematic masonry gallery that powers the homepage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View site
            </a>
          </Button>
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Filter className="h-4 w-4" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={mediaFilter} onValueChange={setMediaFilter}>
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue placeholder="Media" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All media</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c: string) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as any)}>
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          )}

          <div className="ml-1 flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
            <ViewButton active={view === "table"} onClick={() => setView("table")} icon={Rows3} label="Table" />
            <ViewButton active={view === "grid"} onClick={() => setView("grid")} icon={LayoutGrid} label="Grid" />
            <ViewButton active={view === "masonry"} onClick={() => setView("masonry")} icon={Columns3} label="Masonry" />
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3"
        >
          <span className="text-sm font-medium">{selected.size} selected</span>
          <div className="h-4 w-px bg-white/10" />
          <Button size="sm" variant="outline" onClick={() => applyBulkStatus("published", true)}>
            Publish
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyBulkStatus("draft", false)}>
            Unpublish
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyBulkStatus("archived")}>
            Archive
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setBulkDeleteOpen(true)}>
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </motion.div>
      )}

      {/* Content */}
      {projects === undefined ? (
        <SkeletonTable />
      ) : filtered.length === 0 ? (
        <EmptyState onCreate={openCreate} hasFilters={hasFilters} />
      ) : view === "table" ? (
        <TableView
          items={filtered}
          selected={selected}
          onToggleAll={toggleAll}
          allSelected={allVisibleSelected}
          onToggleOne={toggleOne}
          onEdit={openEdit}
          onDuplicate={doDuplicate}
          onDelete={setDeleteTarget}
        />
      ) : view === "grid" ? (
        <CardGrid items={filtered} onEdit={openEdit} onDuplicate={doDuplicate} onDelete={setDeleteTarget} />
      ) : (
        <MasonryView items={filtered} onEdit={openEdit} onDuplicate={doDuplicate} onDelete={setDeleteTarget} />
      )}

      {/* Editor */}
      <EditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        project={editing}
        categories={categories}
        onCreate={create}
        onUpdate={update}
      />

      {/* Single delete */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleteTarget?.title}” will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} projects?</AlertDialogTitle>
            <AlertDialogDescription>
              These projects will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SkeletonTable() {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded-md bg-white/5" />
        ))}
      </div>
    </Card>
  );
}

function EmptyState({ onCreate, hasFilters }: { onCreate: () => void; hasFilters: boolean }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
        <Columns3 className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="text-lg font-medium">{hasFilters ? "No matches" : "No projects yet"}</div>
      <p className="max-w-sm text-sm text-muted-foreground">
        {hasFilters
          ? "Try adjusting your filters or search query."
          : "Create your first production wall entry to populate the homepage gallery."}
      </p>
      {!hasFilters && (
        <Button onClick={onCreate} className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      )}
    </Card>
  );
}

function Thumb({ src, title }: { src?: string; title?: string }) {
  return (
    <div className="h-10 w-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-white/5">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={title ?? ""} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
          —
        </div>
      )}
    </div>
  );
}

function TableView({
  items,
  selected,
  onToggleAll,
  allSelected,
  onToggleOne,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  items: Project[];
  selected: Set<string>;
  onToggleAll: () => void;
  allSelected: boolean;
  onToggleOne: (id: string) => void;
  onEdit: (p: Project) => void;
  onDuplicate: (id: Id<"projects">) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox checked={allSelected} onCheckedChange={onToggleAll} aria-label="Select all" />
            </TableHead>
            <TableHead className="min-w-[220px]">Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Year</TableHead>
            <TableHead className="hidden sm:table-cell">Flags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p: Project) => {
            const isSel = selected.has(p._id);
            return (
              <TableRow key={p._id} data-state={isSel ? "selected" : undefined}>
                <TableCell>
                  <Checkbox checked={isSel} onCheckedChange={() => onToggleOne(p._id)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Thumb src={p.thumbnail} title={p.title} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate font-medium">
                        {p.title}
                        {p.pinned && <Pin className="h-3 w-3 text-primary" />}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {p.client || p.brand || "—"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {p.category || "—"}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {p.year || "—"}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {p.featured ? (
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    ) : (
                      <Star className="h-4 w-4 opacity-30" />
                    )}
                    {p.published ? (
                      <Eye className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 opacity-40" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <RowActions p={p} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

function RowActions({
  p,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  p: Project;
  onEdit: (p: Project) => void;
  onDuplicate: (id: Id<"projects">) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(p)}>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate(p._id)}>
          <Copy className="h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={p.externalUrl || "#"} target="_blank" rel="noreferrer" className={!p.externalUrl ? "pointer-events-none opacity-40" : ""}>
            <ExternalLink className="h-4 w-4" />
            Open link
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(p)}
          className="text-red-300 focus:text-red-200"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CardGrid({
  items,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  items: Project[];
  onEdit: (p: Project) => void;
  onDuplicate: (id: Id<"projects">) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((p: Project) => (
        <motion.div key={p._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="group overflow-hidden transition-colors hover:border-white/20">
            <button onClick={() => onEdit(p)} className="block aspect-[4/3] w-full overflow-hidden bg-white/5">
              {p.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.thumbnail} alt={p.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No thumbnail
                </div>
              )}
            </button>
            <div className="space-y-2 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 truncate text-sm font-medium">
                    {p.title}
                    {p.pinned && <Pin className="h-3 w-3 shrink-0 text-primary" />}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{p.client || p.brand || "—"}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {p.featured && <Star className="h-3.5 w-3.5 fill-primary text-primary" />}
                  {p.published ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5 opacity-40" />}
                </div>
                <RowActions p={p} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function MasonryView({
  items,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  items: Project[];
  onEdit: (p: Project) => void;
  onDuplicate: (id: Id<"projects">) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4">
      {items.map((p: Project) => (
        <Card key={p._id} className="group block break-inside-avoid overflow-hidden transition-colors hover:border-white/20">
          <button onClick={() => onEdit(p)} className="block w-full overflow-hidden bg-white/5">
            {p.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.thumbnail} alt={p.title} className="w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center text-sm text-muted-foreground">
                No thumbnail
              </div>
            )}
          </button>
          <div className="flex items-center justify-between gap-2 p-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1 truncate text-sm font-medium">
                {p.title}
                {p.pinned && <Pin className="h-3 w-3 shrink-0 text-primary" />}
              </div>
              <div className="truncate text-xs text-muted-foreground">{p.client || p.brand || "—"}</div>
            </div>
            <RowActions p={p} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ----------------------------- Editor Dialog ----------------------------- */

function EditorDialog({
  open,
  onOpenChange,
  project,
  categories,
  onCreate,
  onUpdate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  project: Project | null;
  categories: string[];
  onCreate: any;
  onUpdate: any;
}) {
  const [form, setForm] = React.useState(emptyForm);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    if (project) {
      setForm({
        title: project.title ?? "",
        slug: project.slug ?? "",
        client: project.client ?? "",
        brand: project.brand ?? "",
        campaign: project.campaign ?? "",
        category: project.category ?? "",
        description: project.description ?? "",
        role: project.role ?? "",
        year: project.year ?? "",
        featured: !!project.featured,
        published: project.published ?? true,
        status: (project.status ?? "draft") as Status,
        pinned: !!project.pinned,
        thumbnail: project.thumbnail ?? "",
        video: project.video ?? "",
        instagramUrl: project.instagramUrl ?? "",
        youtubeUrl: project.youtubeUrl ?? "",
        externalUrl: project.externalUrl ?? "",
        orientation: project.orientation ?? "",
        aspectRatio: project.aspectRatio ?? "",
        mediaType: (project.mediaType ?? "") as any,
        autoThumbnail: !!project.autoThumbnail,
        gallery: joinList(project.gallery),
        videos: joinList(project.videos),
        tags: joinList(project.tags),
        credits: joinList(project.credits),
        bts: joinList(project.bts),
        metaDescription: project.metaDescription ?? "",
        keywords: joinList(project.keywords),
        altText: project.altText ?? "",
        sortOrder: project.sortOrder != null ? String(project.sortOrder) : "",
        documents: project.documents ?? [],
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, project]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload: any = {
      title: form.title.trim(),
      client: form.client.trim() || undefined,
      brand: form.brand.trim() || undefined,
      campaign: form.campaign.trim() || undefined,
      category: form.category.trim() || undefined,
      description: form.description.trim() || undefined,
      role: form.role.trim() || undefined,
      year: form.year.trim() || undefined,
      featured: form.featured,
      published: form.published,
      status: form.status,
      pinned: form.pinned,
      thumbnail: form.thumbnail.trim() || undefined,
      video: form.video.trim() || undefined,
      instagramUrl: form.instagramUrl.trim() || undefined,
      youtubeUrl: form.youtubeUrl.trim() || undefined,
      externalUrl: form.externalUrl.trim() || undefined,
      orientation: form.orientation.trim() || undefined,
      aspectRatio: form.aspectRatio.trim() || undefined,
      mediaType: form.mediaType || undefined,
      autoThumbnail: form.autoThumbnail,
      gallery: splitList(form.gallery),
      videos: splitList(form.videos),
      tags: splitList(form.tags),
      credits: splitList(form.credits),
      bts: splitList(form.bts),
      metaDescription: form.metaDescription.trim() || undefined,
      keywords: splitList(form.keywords),
      altText: form.altText.trim() || undefined,
      slug: form.slug.trim() || undefined,
      sortOrder: form.sortOrder === "" ? undefined : Number(form.sortOrder),
      documents: form.documents,
    };
    try {
      if (project) {
        await onUpdate({ id: project._id, ...payload });
        toast.success("Project updated");
      } else {
        await onCreate(payload);
        toast.success("Project created");
      }
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-white/10 px-6 py-4">
          <DialogTitle>{project ? "Edit Project" : "New Project"}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-5">
          <Tabs defaultValue="basics">
            <TabsList className="mb-5 flex-wrap">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="content">Content & SEO</TabsTrigger>
              <TabsTrigger value="publish">Publish</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-4">
              <Field label="Title" required>
                <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Project title" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Slug">
                  <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" />
                </Field>
                <Field label="Client">
                  <Input value={form.client} onChange={(e) => set("client", e.target.value)} />
                </Field>
                <Field label="Brand">
                  <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} />
                </Field>
                <Field label="Campaign">
                  <Input value={form.campaign} onChange={(e) => set("campaign", e.target.value)} />
                </Field>
                <Field label="Category">
                  <Input
                    list="cat-list"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    placeholder="e.g. Brand Films"
                  />
                  <datalist id="cat-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Year">
                  <Input value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2024" />
                </Field>
                <Field label="Role">
                  <Input value={form.role} onChange={(e) => set("role", e.target.value)} />
                </Field>
                <Field label="Sort order">
                  <Input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => set("sortOrder", e.target.value)}
                    placeholder="lower = higher on wall"
                  />
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <Field label="Thumbnail URL">
                <Input value={form.thumbnail} onChange={(e) => set("thumbnail", e.target.value)} placeholder="https://…" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Video URL">
                  <Input value={form.video} onChange={(e) => set("video", e.target.value)} placeholder="YouTube / Vimeo" />
                </Field>
                <Field label="Media type">
                  <Select value={form.mediaType || "none"} onValueChange={(v) => set("mediaType", v === "none" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Auto</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Orientation">
                  <Input value={form.orientation} onChange={(e) => set("orientation", e.target.value)} placeholder="landscape / portrait" />
                </Field>
                <Field label="Aspect ratio">
                  <Input value={form.aspectRatio} onChange={(e) => set("aspectRatio", e.target.value)} placeholder="16:9 / 4:5" />
                </Field>
              </div>
              <Field label="Gallery image URLs (comma or newline separated)">
                <Textarea value={form.gallery} onChange={(e) => set("gallery", e.target.value)} rows={3} />
              </Field>
              <Field label="Additional videos (comma separated)">
                <Textarea value={form.videos} onChange={(e) => set("videos", e.target.value)} rows={2} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Instagram">
                  <Input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
                </Field>
                <Field label="YouTube">
                  <Input value={form.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} />
                </Field>
                <Field label="External URL">
                  <Input value={form.externalUrl} onChange={(e) => set("externalUrl", e.target.value)} />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.autoThumbnail} onCheckedChange={(v) => set("autoThumbnail", v)} />
                Auto-generate thumbnail from video
              </label>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Field label="Description">
                <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tags (comma separated)">
                  <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} />
                </Field>
                <Field label="Keywords (comma separated)">
                  <Input value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
                </Field>
                <Field label="Credits (comma separated)">
                  <Input value={form.credits} onChange={(e) => set("credits", e.target.value)} />
                </Field>
                <Field label="Behind-the-scenes (comma separated)">
                  <Input value={form.bts} onChange={(e) => set("bts", e.target.value)} />
                </Field>
              </div>
              <Field label="Alt text">
                <Input value={form.altText} onChange={(e) => set("altText", e.target.value)} />
              </Field>
              <Field label="Meta description (SEO)">
                <Textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2} />
              </Field>
              <Field label="Documents / decks">
                <DocEditor
                  docs={form.documents}
                  onChange={(docs) => set("documents", docs)}
                />
              </Field>
            </TabsContent>

            <TabsContent value="publish" className="space-y-5">
              <Field label="Status">
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <ToggleRow label="Published" hint="Visible on the live wall" checked={form.published} onChange={(v) => set("published", v)} />
                <ToggleRow label="Featured" hint="Highlighted in featured sections" checked={form.featured} onChange={(v) => set("featured", v)} />
                <ToggleRow label="Pinned" hint="Stays anchored on the wall" checked={form.pinned} onChange={(v) => set("pinned", v)} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="border-t border-white/10 px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? "Save changes" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </Label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function DocEditor({
  docs,
  onChange,
}: {
  docs: { label: string; url: string }[];
  onChange: (docs: { label: string; url: string }[]) => void;
}) {
  const update = (i: number, k: "label" | "url", v: string) => {
    const next = docs.map((d, idx) => (idx === i ? { ...d, [k]: v } : d));
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {docs.map((d, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={d.label}
            onChange={(e) => update(i, "label", e.target.value)}
            placeholder="Label"
            className="w-1/3"
          />
          <Input
            value={d.url}
            onChange={(e) => update(i, "url", e.target.value)}
            placeholder="URL"
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => onChange(docs.filter((_, idx) => idx !== i))}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...docs, { label: "", url: "" }])}>
        <Plus className="mr-1 h-4 w-4" />
        Add document
      </Button>
    </div>
  );
}
