"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { animate } from "framer-motion";
import { useId, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import {
  LayoutGrid,
  GalleryHorizontal,
  Image as ImageIcon,
  MessageSquare,
  Clock,
  Eye,
  HardDrive,
  Plus,
  Upload,
  ExternalLink,
  Rocket,
  FolderPlus,
  Video,
  FileText,
  Play,
  Camera,
  Copy,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  ImageOff,
  Link2Off,
  Layers,
  Globe,
  Pencil,
  Trash2,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";

const GOLD = "#c8a24d";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  GalleryHorizontal,
  Image: ImageIcon,
  MessageSquare,
  Clock,
  Eye,
  HardDrive,
};

/* ----------------------------- helpers ----------------------------- */

function formatNumber(n: number) {
  return Math.round(n).toLocaleString();
}

function formatBytes(n: number) {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return (n / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + u[i];
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function Counter({ value, format }: { value: number; format?: (n: number) => string }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setD(v),
    });
    return () => controls.stop();
  }, [value]);
  return <>{format ? format(Math.round(d)) : formatNumber(Math.round(d))}</>;
}

function Sparkline({ data, color = GOLD }: { data: number[]; color?: string }) {
  const w = 140;
  const h = 44;
  const p = 4;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = p + (i / (data.length - 1)) * (w - 2 * p);
    const y = h - p - ((d - min) / range) * (h - 2 * p);
    return [x, y];
  });
  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${p},${h - p} ${line} ${w - p},${h - p}`;
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-11 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.5" fill={color} />
    </svg>
  );
}

function Donut({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 58;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
        {data.map((d) => {
          const len = (d.value / total) * circ;
          const seg = (
            <circle
              key={d.name}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += len;
          return seg;
        })}
        <text x="80" y="76" textAnchor="middle" className="fill-white text-2xl font-bold">
          {total}
        </text>
        <text x="80" y="96" textAnchor="middle" className="fill-zinc-500 text-[10px] uppercase tracking-widest">
          Items
        </text>
      </svg>
      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-zinc-300">{d.name}</span>
            <span className="ml-auto font-medium text-zinc-100">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="font-medium text-zinc-100">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Card({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-colors hover:border-white/20 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, sub }: { icon: React.ComponentType<{ className?: string }>; title: string; sub?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c8a24d]/20 to-fuchsia-500/10 text-[#c8a24d]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
        {sub && <p className="text-xs text-zinc-500">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    draft: "bg-zinc-500/15 text-zinc-300 border-zinc-500/20",
    archived: "bg-red-500/15 text-red-300 border-red-500/20",
    read: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    unread: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${map[status] ?? map.draft}`}>
      {status}
    </span>
  );
}

/* ----------------------------- page ----------------------------- */

export default function AdminDashboard() {
  const router = useRouter();
  const data = useQuery(api.dashboard.getDashboard);
  const removeProject = useMutation(api.projects.remove);
  const duplicateProject = useMutation(api.projects.duplicate);

  const [greet, setGreet] = useState("Welcome");
  useEffect(() => {
    const h = new Date().getHours();
    setGreet(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  if (data === undefined) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-[#c8a24d]" />
          Loading dashboard…
        </div>
      </div>
    );
  }

  const mediaKpi = data.kpis.find((k) => k.key === "media")!;
  const maxCat = Math.max(...data.byCategory.map((c) => c.count), 1);
  const maxStore = Math.max(...Object.values(data.storage.byType).map((v) => v as number), 1);

  const quickActions = [
    { label: "Create Project", icon: FolderPlus, onClick: () => router.push("/admin/projects") },
    { label: "Upload Video", icon: Video, onClick: () => router.push("/admin/media") },
    { label: "Upload Image", icon: ImageIcon, onClick: () => router.push("/admin/media") },
    { label: "Upload PDF", icon: FileText, onClick: () => router.push("/admin/media") },
    { label: "Import YouTube", icon: Play, onClick: () => toast.info("YouTube import coming soon") },
    { label: "Import Instagram", icon: Camera, onClick: () => toast.info("Instagram import coming soon") },
    { label: "Duplicate Project", icon: Copy, onClick: () => toast.info("Open a project to duplicate it") },
    { label: "Backup Database", icon: Database, onClick: () => toast.info("Backups run automatically on Convex") },
  ];

  return (
    <div className="relative space-y-8">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#c8a24d]/10 blur-3xl" />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live · Production
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-zinc-400">
            {greet}, Donayan. <span className="text-zinc-500">Overview of your portfolio.</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => router.push("/admin/projects")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            <Plus className="h-4 w-4" /> New Project
          </button>
          <button
            onClick={() => router.push("/admin/media")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            <Upload className="h-4 w-4" /> Upload Media
          </button>
          <button
            onClick={() => router.push("/admin/wall")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            <Plus className="h-4 w-4" /> Create Wall Item
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" /> Preview Website
          </a>
          <button
            onClick={() => toast.success("Site is live on production")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c8a24d] to-[#a8801f] px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#c8a24d]/20 transition-transform hover:scale-[1.02]"
          >
            <Rocket className="h-4 w-4" /> Publish Changes
          </button>
        </div>
      </motion.div>

      {/* FIRST ROW — KPIs */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {data.kpis.map((k, i) => {
          const Icon = ICONS[k.icon] ?? Activity;
          const up = (k.growth ?? 0) >= 0;
          return (
            <Card key={k.key} delay={i * 0.05} className="overflow-hidden">
              <div className="flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${k.color}1a`, color: k.color }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    up ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"
                  }`}
                >
                  {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {k.isNew ? "NEW" : `${Math.abs(k.growth)}%`}
                </span>
              </div>
              <div className="mt-4 text-3xl font-bold tracking-tight text-white">
                <Counter value={k.value} format={k.isBytes ? formatBytes : formatNumber} />
              </div>
              <div className="mt-1 text-sm text-zinc-400">{k.label}</div>
              <div className="mt-3">
                <Sparkline data={k.spark} color={k.color} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* SECOND ROW — analytics + quick actions */}
      <div className="grid gap-8 lg:grid-cols-10">
        <div className="space-y-8 lg:col-span-7">
          <Card>
            <SectionTitle icon={TrendingUp} title="Portfolio Analytics" sub="Distribution across your content" />
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Projects by category</div>
                <div className="space-y-4">
                  {data.byCategory.map((c) => (
                    <BarRow key={c.name} label={c.name} value={c.count} max={maxCat} color={GOLD} />
                  ))}
                  {data.byCategory.length === 0 && <p className="text-sm text-zinc-500">No projects yet.</p>}
                </div>
              </div>
              <div>
                <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Content mix</div>
                <Donut data={data.mediaTypeBreakdown} />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle icon={Activity} title="Recent Uploads" sub="Media added over the last 7 days" />
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <Sparkline data={mediaKpi.spark} color="#3b82f6" />
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <span>7 days ago</span>
                <span className="text-zinc-300">
                  {mediaKpi.spark.reduce((a, b) => a + b, 0)} uploads this week
                </span>
                <span>Today</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <SectionTitle icon={Zap} title="Quick Actions" sub="Jump into common tasks" />
            <div className="space-y-2">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className="group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 text-left text-sm text-zinc-300 transition-colors hover:border-[#c8a24d]/30 hover:bg-[#c8a24d]/5 hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#c8a24d] transition-colors group-hover:bg-[#c8a24d]/15">
                    <a.icon className="h-4 w-4" />
                  </span>
                  {a.label}
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* THIRD ROW — recent projects + side lists */}
      <Card>
        <div className="mb-5 flex items-center justify-between">
          <SectionTitle icon={LayoutGrid} title="Recent Projects" sub={`${data.counts.projects} total projects`} />
          <button
            onClick={() => router.push("/admin/projects")}
            className="text-sm font-medium text-[#c8a24d] hover:underline"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-zinc-500">
                <th className="pb-3 pl-2 font-medium">Project</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Updated</th>
                <th className="pb-3 font-medium">Views</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.recentProjects.map((p) => (
                <tr key={p._id} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 overflow-hidden rounded-lg border border-white/10 bg-black/40">
                        {p.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.thumbnail} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-600">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-zinc-100">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-3 text-zinc-400">{p.category}</td>
                  <td className="py-3 text-zinc-500">{timeAgo(p._creationTime)}</td>
                  <td className="py-3 text-zinc-500">—</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push("/admin/projects")}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`Duplicate "${p.title}"?`)) return;
                          try {
                            await duplicateProject({ id: p._id });
                            toast.success("Project duplicated");
                          } catch (e: any) {
                            toast.error(e?.message || "Failed");
                          }
                        }}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete "${p.title}"?`)) return;
                          try {
                            await removeProject({ id: p._id });
                            toast.success("Project deleted");
                          } catch (e: any) {
                            toast.error(e?.message || "Failed");
                          }
                        }}
                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.recentProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No projects yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Media Activity */}
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <SectionTitle icon={ImageIcon} title="Media Activity" sub="Latest uploads" />
            <button onClick={() => router.push("/admin/media")} className="text-sm font-medium text-[#c8a24d] hover:underline">
              View all
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {data.recentMedia.slice(0, 9).map((m) => (
              <div
                key={m._id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40"
                title={`${m.name} · ${formatBytes(m.size)}`}
              >
                {m.type === "image" && m.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-zinc-500">
                    {m.type === "video" ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    <span className="px-1 text-center text-[10px] leading-tight">{m.name}</span>
                  </div>
                )}
              </div>
            ))}
            {data.recentMedia.length === 0 && (
              <p className="col-span-3 py-6 text-center text-sm text-zinc-500">No media uploaded yet.</p>
            )}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <SectionTitle icon={MessageSquare} title="Recent Messages" sub={`${data.counts.messages} total`} />
            <button onClick={() => router.push("/admin/contact")} className="text-sm font-medium text-[#c8a24d] hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {data.recentMessages.map((m) => (
              <button
                key={m._id}
                onClick={() => router.push("/admin/contact")}
                className="block w-full rounded-xl border border-white/5 bg-white/[0.03] p-3 text-left transition-colors hover:border-[#c8a24d]/30 hover:bg-[#c8a24d]/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-100">{m.name}</span>
                  <StatusBadge status={m.status} />
                </div>
                <div className="mt-0.5 truncate text-xs text-zinc-400">{m.subject || m.message}</div>
                <div className="mt-1 text-[11px] text-zinc-600">{timeAgo(m._creationTime)}</div>
              </button>
            ))}
            {data.recentMessages.length === 0 && (
              <p className="py-6 text-center text-sm text-zinc-500">No messages yet.</p>
            )}
          </div>
        </Card>

        {/* Recent Timeline */}
        <Card>
          <SectionTitle icon={Clock} title="Recent Timeline" sub={`${data.counts.timeline} entries`} />
          <div className="space-y-3">
            {data.recentTimeline.map((t) => (
              <div key={t._id} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-100">{t.company}</span>
                  <span className="text-[11px] text-zinc-600">{timeAgo(t._creationTime)}</span>
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  {t.roleTitle || "Role"} · {t.startDate}
                </div>
              </div>
            ))}
            {data.recentTimeline.length === 0 && (
              <p className="py-6 text-center text-sm text-zinc-500">No timeline entries yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* FOURTH ROW — storage + SEO */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <SectionTitle icon={HardDrive} title="Storage" sub="Usage across Convex File Storage" />
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-white">
                <Counter value={data.storage.totalBytes} format={formatBytes} />
              </div>
              <div className="text-xs text-zinc-500">Total used · {data.counts.media} files</div>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <div className="font-semibold text-zinc-100">{data.storage.counts.images}</div>
                <div className="text-xs text-zinc-500">Images</div>
              </div>
              <div>
                <div className="font-semibold text-zinc-100">{data.storage.counts.videos}</div>
                <div className="text-xs text-zinc-500">Videos</div>
              </div>
              <div>
                <div className="font-semibold text-zinc-100">{data.storage.counts.pdfs}</div>
                <div className="text-xs text-zinc-500">PDFs</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <BarRow label="Images" value={data.storage.byType.images} max={maxStore} color="#22c55e" />
            <BarRow label="Videos" value={data.storage.byType.videos} max={maxStore} color="#3b82f6" />
            <BarRow label="PDFs" value={data.storage.byType.pdfs} max={maxStore} color="#f59e0b" />
          </div>
        </Card>

        <Card>
          <SectionTitle icon={ShieldCheck} title="SEO Health" sub="Automated content audit" />
          <div className="grid grid-cols-2 gap-3">
            <SeoStat icon={ImageOff} label="Missing thumbnails" value={data.seo.missingThumbnail} total={data.seo.total} color="#f59e0b" />
            <SeoStat icon={FileText} label="Missing descriptions" value={data.seo.missingDescription} total={data.seo.total} color="#ef4444" />
            <SeoStat icon={Link2Off} label="Broken links" value={data.seo.brokenLinks} total={data.seo.total} color="#ec4899" />
            <SeoStat icon={Layers} label="Duplicate content" value={data.seo.duplicateContent} total={data.seo.total} color="#a855f7" />
          </div>
          <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-4 text-sm text-zinc-400">
            {data.seo.missingDescription + data.seo.missingThumbnail + data.seo.brokenLinks + data.seo.duplicateContent === 0 ? (
              <span className="text-emerald-300">All projects are SEO-healthy. 🎉</span>
            ) : (
              <span>
                {data.seo.missingDescription + data.seo.missingThumbnail + data.seo.brokenLinks + data.seo.duplicateContent} issue
                {(data.seo.missingDescription + data.seo.missingThumbnail + data.seo.brokenLinks + data.seo.duplicateContent) === 1 ? "" : "s"} to review across {data.seo.total} projects.
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* FIFTH ROW — website preview */}
      <Card>
        <SectionTitle icon={Globe} title="Website Preview" sub="Live production deployment" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/og.png" alt="Website preview" className="h-full w-full object-cover" />
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-widest text-zinc-500">Domain</div>
              <a href="https://donayan.com" target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-2 text-lg font-semibold text-white hover:text-[#c8a24d]">
                donayan.com <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-widest text-zinc-500">Latest deployment</div>
              <div className="mt-1 flex items-center gap-2 text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Production · Vercel
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-widest text-zinc-500">Analytics</div>
              <div className="mt-1 text-2xl font-bold text-white">
                <Counter value={data.totalViews} />
              </div>
              <div className="text-xs text-zinc-500">Total page views (live)</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SeoStat({
  icon: Icon,
  label,
  value,
  total,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
      <div className="text-[11px] text-zinc-600">of {total} projects</div>
    </div>
  );
}
