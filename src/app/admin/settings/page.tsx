"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon,
  Search,
  Globe,
  Palette,
  Phone,
  Mail,
  MessageCircle,
  Camera,
  Briefcase,
  Play,
  Link2,
  Copy,
  Check,
  Image as ImageIcon,
  FileImage,
  Sparkles,
  Activity,
  Database,
  HardDrive,
  LayoutGrid,
  FileText,
  Save,
  Rocket,
  Eye,
  ChevronRight,
  Plus,
  Trash2,
  X,
  ShieldCheck,
  BarChart3,
  Navigation,
  ArrowUpRight,
  Share2,
  SlidersHorizontal,
  LayoutPanelTop,
  Type,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Users,
  ShieldOff,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

type SettingsForm = {
  siteTitle: string;
  seoTitle: string;
  seoDescription: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  email: string;
  phone: string;
  location: string;
  footer: string;
  copyright: string;
};

const EMPTY: SettingsForm = {
  siteTitle: "Donayan Sahdev",
  seoTitle: "",
  seoDescription: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  email: "",
  phone: "",
  location: "",
  footer: "",
  copyright: "",
};

/* ------------------------------------------------------------------ */
/* Small primitives                                                   */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 transition-colors duration-200 hover:border-zinc-700">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-[#c8a24d]">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
            {description && <p className="mt-0.5 text-sm text-zinc-500">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function TextField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  hint,
  error,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  hint?: string;
  error?: string;
}) {
  const len = value?.length ?? 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-zinc-400">{label}</Label>
        {maxLength !== undefined && (
          <span className={cn("text-[11px]", len > maxLength ? "text-red-400" : "text-zinc-600")}>
            {len}/{maxLength}
          </span>
        )}
      </div>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          maxLength={maxLength}
          className={cn(
            "h-12 w-full rounded-xl border bg-zinc-900/60 pl-10 pr-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:ring-1",
            error
              ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/30"
              : "border-zinc-800 focus:border-[#c8a24d] focus:ring-[#c8a24d]/40",
            !Icon && "pl-3",
          )}
        />
      </div>
      {error ? (
        <p className="text-[11px] text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-zinc-600">{hint}</p>
      ) : null}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  hint?: string;
}) {
  const len = value?.length ?? 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-zinc-400">{label}</Label>
        {maxLength !== undefined && (
          <span className={cn("text-[11px]", len > maxLength ? "text-red-400" : "text-zinc-600")}>
            {len}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-[#c8a24d] focus:ring-1 focus:ring-[#c8a24d]/40"
      />
      {hint && <p className="text-[11px] text-zinc-600">{hint}</p>}
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("block", className)}>{children}</span>;
}

function UploadTile({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-6 w-6 text-zinc-600" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-zinc-200">{label}</div>
        <div className="text-xs text-zinc-500">{value ? "Click to replace" : "PNG, SVG or JPG"}</div>
      </div>
      <label className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700">
        {value ? "Replace" : "Upload"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = () => onChange(r.result as string);
            r.readAsDataURL(f);
          }}
        />
      </label>
    </div>
  );
}

function StatPill({ tone, children }: { tone: "green" | "yellow" | "red" | "zinc"; children: React.ReactNode }) {
  const map = {
    green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
    yellow: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
    red: "bg-red-500/10 text-red-400 ring-red-500/30",
    zinc: "bg-zinc-500/10 text-zinc-400 ring-zinc-500/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1", map[tone])}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "seo", label: "SEO", icon: Search },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "social", label: "Social", icon: Share2 },
  { id: "navigation", label: "Navigation", icon: Navigation },
  { id: "footer", label: "Footer", icon: LayoutPanelTop },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "advanced", label: "Advanced", icon: SlidersHorizontal },
  { id: "team", label: "Team", icon: Users },
] as const;

export default function SettingsPage() {
  const settings = useQuery(api.settings.get);
  const projects = useQuery(api.projects.list, {}) ?? [];
  const media = useQuery(api.media.list, {}) ?? [];
  const team = useQuery(api.users.list) ?? [];
  const upsert = useMutation(api.settings.upsert);
  const setRole = useMutation(api.users.setRole);

  const [tab, setTab] = React.useState<(typeof TABS)[number]["id"]>("general");
  const [form, setForm] = React.useState<SettingsForm>(EMPTY);
  const [loaded, setLoaded] = React.useState<SettingsForm>(EMPTY);
  const [localDirty, setLocalDirty] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);
  const [autosave, setAutosave] = React.useState(true);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [, forceTick] = React.useState(0);

  // Local-only (no backend field) UI state
  const [branding, setBranding] = React.useState({
    logo: null as string | null,
    favicon: null as string | null,
    ogImage: null as string | null,
    brandColor: "#c8a24d",
    accentColor: "#8a0467",
    font: "Inter",
  });
  const [nav, setNav] = React.useState([
    { label: "Home", href: "/", enabled: true },
    { label: "About", href: "/about", enabled: true },
    { label: "Timeline", href: "/timeline", enabled: true },
    { label: "Contact", href: "/contact", enabled: true },
    { label: "Wall", href: "/wall", enabled: true },
    { label: "Archive", href: "/archive", enabled: true },
  ]);
  const [footerLinks, setFooterLinks] = React.useState([
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ]);
  const [localWhatsapp, setWhatsapp] = React.useState("");
  const [localWebsite, setWebsite] = React.useState("");

  React.useEffect(() => {
    if (settings !== undefined) {
      const next: SettingsForm = {
        siteTitle: settings?.siteTitle ?? EMPTY.siteTitle,
        seoTitle: settings?.seoTitle ?? "",
        seoDescription: settings?.seoDescription ?? "",
        instagram: settings?.instagram ?? "",
        linkedin: settings?.linkedin ?? "",
        youtube: settings?.youtube ?? "",
        email: settings?.email ?? "",
        phone: settings?.phone ?? "",
        location: settings?.location ?? "",
        footer: settings?.footer ?? "",
        copyright: settings?.copyright ?? "",
      };
      setForm(next);
      setLoaded(next);
    }
  }, [settings]);

  const set = (k: keyof SettingsForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const dirty = React.useMemo(() => {
    if (localDirty) return true;
    return JSON.stringify(form) !== JSON.stringify(loaded);
  }, [form, loaded, localDirty]);

  const markLocal = () => setLocalDirty(true);

  const save = React.useCallback(async () => {
    setSaving(true);
    try {
      await upsert({
        siteTitle: form.siteTitle || EMPTY.siteTitle,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        instagram: form.instagram || undefined,
        linkedin: form.linkedin || undefined,
        youtube: form.youtube || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        location: form.location || undefined,
        footer: form.footer || undefined,
        copyright: form.copyright || undefined,
      });
      setLoaded({ ...form });
      setLocalDirty(false);
      setSavedAt(new Date());
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save");
    }
    setSaving(false);
  }, [form, upsert]);

  // Autosave
  React.useEffect(() => {
    if (!dirty || !autosave || saving) return;
    const t = setTimeout(() => save(), 1200);
    return () => clearTimeout(t);
  }, [dirty, autosave, saving, save]);

  // Relative-time ticker
  React.useEffect(() => {
    const i = setInterval(() => forceTick((n) => n + 1), 30000);
    return () => clearInterval(i);
  }, []);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  if (settings === undefined) {
    return (
      <div className="mx-auto w-full max-w-[1600px] animate-pulse space-y-6">
        <div className="h-20 rounded-2xl bg-zinc-900" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="h-96 rounded-2xl bg-zinc-900 lg:col-span-8" />
          <div className="h-96 rounded-2xl bg-zinc-900 lg:col-span-4" />
        </div>
      </div>
    );
  }

  const published = projects.filter((p: any) => p.published).length;
  const drafts = projects.length - published;
  const storageBytes = media.reduce((acc: number, m: any) => acc + (m.size ?? 0), 0);
  const recent = [...projects].sort((a: any, b: any) => (b.sortOrder ?? 0) - (a.sortOrder ?? 0)).slice(0, 4);

  const emailError = form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "Enter a valid email" : undefined;

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-4 border-b border-zinc-800 pb-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">Settings</h1>
            <StatusPill dirty={dirty} />
          </div>
          <p className="mt-1 text-sm text-zinc-500">Manage your portfolio configuration.</p>
          {!dirty && savedAt && <p className="mt-1 text-xs text-zinc-600">Last updated {timeAgo(savedAt)}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={save} disabled={saving || !dirty}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save Changes"}
          </Button>
          <Button size="sm" onClick={save} disabled={saving || !dirty}>
            <Rocket className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </motion.div>

      {/* Body */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main */}
        <div className="lg:col-span-8">
          {/* Tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-[#c8a24d]/40 bg-[#c8a24d]/10 text-[#c8a24d]"
                      : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-6"
            >
              {tab === "general" && (
                <SectionCard title="General" description="Core site identity and legal text." icon={SettingsIcon}>
                  <TextField label="Site Title" icon={Type} value={form.siteTitle} onChange={(v) => set("siteTitle", v)} placeholder="Donayan Sahdev" maxLength={60} />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="Location" icon={Globe} value={form.location} onChange={(v) => set("location", v)} placeholder="Mumbai, India" />
                    <TextField label="Copyright" icon={FileText} value={form.copyright} onChange={(v) => set("copyright", v)} placeholder="© 2026 Donayan Sahdev" maxLength={80} />
                  </div>
                  <TextArea label="Footer Text" value={form.footer} onChange={(v) => set("footer", v)} placeholder="Crafting cinematic brand stories." maxLength={200} hint="Shown at the bottom of every page." />
                </SectionCard>
              )}

              {tab === "seo" && <SeoTab form={form} set={set} />}

              {tab === "branding" && (
                <div className="space-y-6">
                  <SectionCard title="Brand Assets" description="Logos, favicon and social preview image." icon={Palette}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <UploadTile label="Logo" icon={ImageIcon} value={branding.logo} onChange={(v) => { setBranding((b) => ({ ...b, logo: v })); markLocal(); }} />
                      <UploadTile label="Favicon" icon={FileImage} value={branding.favicon} onChange={(v) => { setBranding((b) => ({ ...b, favicon: v })); markLocal(); }} />
                      <UploadTile label="OG Image" icon={ImageIcon} value={branding.ogImage} onChange={(v) => { setBranding((b) => ({ ...b, ogImage: v })); markLocal(); }} />
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                        <div className="mb-3 text-sm font-medium text-zinc-200">Typography</div>
                        <div className="flex flex-wrap gap-2">
                          {["Inter", "Serif", "Mono"].map((f) => (
                            <button
                              key={f}
                              onClick={() => { setBranding((b) => ({ ...b, font: f })); markLocal(); }}
                              className={cn(
                                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                                branding.font === f ? "border-[#c8a24d]/40 bg-[#c8a24d]/10 text-[#c8a24d]" : "border-zinc-800 text-zinc-400 hover:text-zinc-200",
                              )}
                              style={{ fontFamily: f === "Serif" ? "Georgia, serif" : f === "Mono" ? "monospace" : "inherit" }}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard title="Brand Colors" description="Accent palette used across the site.">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <ColorField label="Brand Color" value={branding.brandColor} onChange={(v) => { setBranding((b) => ({ ...b, brandColor: v })); markLocal(); }} />
                      <ColorField label="Accent Color" value={branding.accentColor} onChange={(v) => { setBranding((b) => ({ ...b, accentColor: v })); markLocal(); }} />
                    </div>
                  </SectionCard>

                  <SectionCard title="Live Preview" description="How your brand appears in context." icon={Eye}>
                    <LivePreview branding={branding} title={form.siteTitle || EMPTY.siteTitle} />
                  </SectionCard>
                </div>
              )}

              {tab === "contact" && (
                <SectionCard title="Contact" description="Reachable channels shown across the site." icon={Phone}>
                  <ContactRow icon={Mail} label="Email" value={form.email} onChange={(v) => set("email", v)} href={form.email ? `mailto:${form.email}` : undefined} onCopy={() => copy(form.email, "email")} copied={copied === "email"} />
                  <ContactRow icon={Phone} label="Phone" value={form.phone} onChange={(v) => set("phone", v)} href={form.phone ? `tel:${form.phone}` : undefined} onCopy={() => copy(form.phone, "phone")} copied={copied === "phone"} />
                  <ContactRow icon={MessageCircle} label="WhatsApp" value={localWhatsapp} onChange={(v) => { setWhatsapp(v); markLocal(); }} href={localWhatsapp ? `https://wa.me/${localWhatsapp.replace(/\D/g, "")}` : undefined} onCopy={() => copy(localWhatsapp, "wa")} copied={copied === "wa"} note="Local preview only" />
                  <ContactRow icon={Globe} label="Website" value={localWebsite} onChange={(v) => { setWebsite(v); markLocal(); }} href={localWebsite || undefined} onCopy={() => copy(localWebsite, "web")} copied={copied === "web"} note="Local preview only" />
                </SectionCard>
              )}

              {tab === "social" && (
                <SectionCard title="Social" description="Profile links surfaced in the footer and contact." icon={Share2}>
                  <ContactRow icon={Camera} label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} href={form.instagram || undefined} onCopy={() => copy(form.instagram, "ig")} copied={copied === "ig"} />
                  <ContactRow icon={Briefcase} label="LinkedIn" value={form.linkedin} onChange={(v) => set("linkedin", v)} href={form.linkedin || undefined} onCopy={() => copy(form.linkedin, "li")} copied={copied === "li"} />
                  <ContactRow icon={Play} label="YouTube" value={form.youtube} onChange={(v) => set("youtube", v)} href={form.youtube || undefined} onCopy={() => copy(form.youtube, "yt")} copied={copied === "yt"} />
                </SectionCard>
              )}

              {tab === "navigation" && (
                <SectionCard title="Navigation" description="Primary menu items (local preview)." icon={Navigation}>
                  <div className="space-y-2">
                    {nav.map((item, i) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
                        <Grip />
                        <input
                          value={item.label}
                          onChange={(e) => { const n = [...nav]; n[i] = { ...n[i], label: e.target.value }; setNav(n); markLocal(); }}
                          className="w-32 bg-transparent text-sm text-zinc-100 outline-none"
                        />
                        <input
                          value={item.href}
                          onChange={(e) => { const n = [...nav]; n[i] = { ...n[i], href: e.target.value }; setNav(n); markLocal(); }}
                          className="flex-1 bg-transparent text-sm text-zinc-500 outline-none"
                        />
                        <Switch checked={item.enabled} onCheckedChange={(v) => { const n = [...nav]; n[i] = { ...n[i], enabled: v }; setNav(n); markLocal(); }} />
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="text-zinc-400" onClick={() => { setNav([...nav, { label: "New Item", href: "/", enabled: true }]); markLocal(); }}>
                      <Plus className="mr-1 h-4 w-4" /> Add item
                    </Button>
                  </div>
                </SectionCard>
              )}

              {tab === "footer" && (
                <SectionCard title="Footer" description="Bottom-of-site links and legal text." icon={LayoutPanelTop}>
                  <TextArea label="Footer Text" value={form.footer} onChange={(v) => set("footer", v)} placeholder="Crafting cinematic brand stories." maxLength={200} />
                  <TextField label="Copyright" value={form.copyright} onChange={(v) => set("copyright", v)} placeholder="© 2026 Donayan Sahdev" maxLength={80} />
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-zinc-400">Footer Links</div>
                    {footerLinks.map((l, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input value={l.label} onChange={(e) => { const n = [...footerLinks]; n[i] = { ...n[i], label: e.target.value }; setFooterLinks(n); markLocal(); }} className="w-40 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100 outline-none" />
                        <input value={l.href} onChange={(e) => { const n = [...footerLinks]; n[i] = { ...n[i], href: e.target.value }; setFooterLinks(n); markLocal(); }} className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-500 outline-none" />
                        <Button variant="ghost" size="icon" className="text-zinc-500" onClick={() => { setFooterLinks(footerLinks.filter((_, idx) => idx !== i)); markLocal(); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="text-zinc-400" onClick={() => { setFooterLinks([...footerLinks, { label: "New Link", href: "/" }]); markLocal(); }}>
                      <Plus className="mr-1 h-4 w-4" /> Add link
                    </Button>
                  </div>
                </SectionCard>
              )}

              {tab === "analytics" && (
                <SectionCard title="Analytics" description="Connect a provider to track visitors." icon={BarChart3}>
                  <EmptyState icon={BarChart3} title="No analytics connected" description="Connect Google Analytics or Plausible to see traffic, referrals and engagement here." />
                  <Button variant="outline" size="sm" className="text-zinc-300" onClick={() => toast.info("Analytics provider connection is not configured yet.")}>
                    <Link2 className="mr-2 h-4 w-4" /> Connect provider
                  </Button>
                </SectionCard>
              )}

              {tab === "security" && (
                <SectionCard title="Security" description="Account and access controls." icon={ShieldCheck}>
                  <ToggleRow label="Two-factor authentication" hint="Require a code at sign-in." checked={false} onChange={() => toast.info("2FA is managed by your auth provider.")} />
                  <ToggleRow label="Session timeout" hint="Auto sign-out after inactivity." checked disabled hint2="Managed by Convex Auth" />
                  <ToggleRow label="Login alerts" hint="Email me on new sign-ins." checked={false} onChange={() => toast.info("Configure your email under Contact to enable.")} />
                </SectionCard>
              )}

              {tab === "advanced" && (
                <SectionCard title="Advanced" description="Power-user options." icon={SlidersHorizontal}>
                  <ToggleRow label="Maintenance mode" hint="Temporarily hide the public site." checked={false} onChange={() => toast.info("Maintenance mode requires a site flag.")} />
                  <ToggleRow label="Cache static assets" hint="Speed up page loads." checked disabled hint2="Always on" />
                  <ToggleRow label="Verbose logs" hint="Log admin actions." checked={false} onChange={() => toast.info("Logging is not configured yet.")} />
                </SectionCard>
              )}

              {tab === "team" && (
                <SectionCard title="Team & Access" description="Only accounts with the admin role can open this console. Promote or revoke access here." icon={Users}>
                  <div className="space-y-2">
                    {team.length === 0 && (
                      <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-sm text-zinc-500">
                        No users found.
                      </div>
                    )}
                    {team.map((u: any) => {
                      const isAdmin = u.role === "admin";
                      return (
                        <div
                          key={u._id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c8a24d] to-fuchsia-500 text-xs font-bold text-white">
                              {(u.name || u.email || "?").slice(0, 1).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-zinc-100">
                                {u.name || "Unnamed"}
                              </div>
                              <div className="truncate text-xs text-zinc-500">{u.email}</div>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {isAdmin ? (
                              <StatPill tone="green">
                                <ShieldCheck className="h-3 w-3" /> Admin
                              </StatPill>
                            ) : (
                              <StatPill tone="zinc">
                                <ShieldOff className="h-3 w-3" /> Member
                              </StatPill>
                            )}
                            <button
                              onClick={async () => {
                                try {
                                  await setRole({ userId: u._id, role: isAdmin ? "member" : "admin" });
                                  toast.success(isAdmin ? "Admin access revoked" : "Promoted to admin");
                                } catch (e: any) {
                                  toast.error(e?.message || "Could not change role");
                                }
                              }}
                              className={cn(
                                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                                isAdmin
                                  ? "border-zinc-800 text-zinc-300 hover:border-red-500/40 hover:text-red-400"
                                  : "border-[#c8a24d]/40 bg-[#c8a24d]/10 text-[#c8a24d] hover:bg-[#c8a24d]/20",
                              )}
                            >
                              {isAdmin ? "Revoke" : "Make admin"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs text-zinc-500">
                    Tip: the very first admin must be created by setting the user’s{" "}
                    <span className="font-mono text-zinc-300">role</span> to{" "}
                    <span className="font-mono text-zinc-300">"admin"</span> in the
                    Convex dashboard (Data → users).
                  </p>
                </SectionCard>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <SidebarCard title="Website Status">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-zinc-400">Environment</span>
                <StatPill tone="green"><Circle className="h-2 w-2 fill-current" /> Production</StatPill>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-zinc-400">Published</span>
                <span className="text-sm font-medium text-zinc-200">{published}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-sm text-zinc-400">Drafts</span>
                <span className="text-sm font-medium text-zinc-200">{drafts}</span>
              </div>
            </SidebarCard>

            <SidebarCard title="Content">
              <MiniStat icon={LayoutGrid} label="Pages" value="6" />
              <MiniStat icon={ImageIcon} label="Projects" value={String(projects.length)} />
              <MiniStat icon={HardDrive} label="Media" value={String(media.length)} />
              <MiniStat icon={Database} label="Storage" value={formatBytes(storageBytes)} />
            </SidebarCard>

            <SidebarCard title="Recent Activity">
              {recent.length === 0 ? (
                <p className="text-sm text-zinc-600">No recent activity.</p>
              ) : (
                recent.map((p: any) => (
                  <div key={p._id} className="flex items-center gap-3 py-1.5">
                    <Activity className="h-4 w-4 text-zinc-600" />
                    <span className="flex-1 truncate text-sm text-zinc-300">{p.title}</span>
                    <span className="text-xs text-zinc-600">project</span>
                  </div>
                ))
              )}
            </SidebarCard>

            <SidebarCard title="Autosave">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Auto-save changes</span>
                <Switch checked={autosave} onCheckedChange={setAutosave} />
              </div>
              <p className="mt-2 text-xs text-zinc-600">Changes save automatically a moment after you stop editing.</p>
            </SidebarCard>

            <SidebarCard title="Quick Links">
              <QuickLink href="/admin/wall" label="Production Wall" icon={LayoutGrid} />
              <QuickLink href="/admin/media" label="Media Library" icon={HardDrive} />
              <QuickLink href="/admin/analytics" label="Analytics" icon={BarChart3} />
              <QuickLink href="/admin" label="Dashboard" icon={SettingsIcon} />
            </SidebarCard>
          </div>
        </aside>
      </div>

      {/* Floating save bar */}
      <AnimatePresence>
        {dirty && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900/90 px-5 py-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              You have unsaved changes
            </div>
            <div className="h-5 w-px bg-zinc-700" />
            <Button variant="ghost" size="sm" onClick={() => { setForm(loaded); setLocalDirty(false); }}>
              Discard
            </Button>
            <Button size="sm" onClick={save} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatusPill({ dirty }: { dirty: boolean }) {
  return dirty ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400 ring-1 ring-amber-500/30">
      <AlertTriangle className="h-3 w-3" /> Unsaved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/30">
      <CheckCircle2 className="h-3 w-3" /> Saved
    </span>
  );
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h4>
      <div className="divide-y divide-zinc-900">{children}</div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon className="h-4 w-4 text-zinc-600" />
      <span className="flex-1 text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-zinc-200">{value}</span>
    </div>
  );
}

function QuickLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <a href={href} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100">
      <Icon className="h-4 w-4" />
      {label}
      <ChevronRight className="ml-auto h-4 w-4 text-zinc-600" />
    </a>
  );
}

function ToggleRow({ label, hint, checked, onChange, disabled, hint2 }: { label: string; hint: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean; hint2?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <div className="text-sm font-medium text-zinc-200">{label}</div>
        <div className="text-xs text-zinc-600">{hint2 ?? hint}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-sm font-medium text-zinc-300">{title}</div>
      <p className="max-w-xs text-xs text-zinc-600">{description}</p>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  onChange,
  href,
  onCopy,
  copied,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  href?: string;
  onCopy: () => void;
  copied: boolean;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 transition-colors hover:border-zinc-700">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {label}
          {note && <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">Preview</span>}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          placeholder={`Add ${label.toLowerCase()}`}
        />
      </div>
      <button onClick={onCopy} className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200" title="Copy">
        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      </button>
      {href && (
        <a href={href} target="_blank" rel="noreferrer" className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-[#c8a24d]" title="Open">
          <ArrowUpRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-zinc-400">{label}</Label>
      <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1.5">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm text-zinc-100 outline-none" />
      </div>
    </div>
  );
}

function Grip() {
  return <span className="cursor-grab text-zinc-600">⋮⋮</span>;
}

function LivePreview({ branding, title }: { branding: { logo: string | null; brandColor: string; accentColor: string; font: string }; title: string }) {
  const fontFamily = branding.font === "Serif" ? "Georgia, serif" : branding.font === "Mono" ? "monospace" : "inherit";
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-950 px-3 py-2">
        <Circle className="h-2.5 w-2.5 fill-red-500/70 text-red-500/70" />
        <Circle className="h-2.5 w-2.5 fill-amber-500/70 text-amber-500/70" />
        <Circle className="h-2.5 w-2.5 fill-emerald-500/70 text-emerald-500/70" />
        <div className="ml-3 truncate rounded-md bg-zinc-900 px-3 py-1 text-[11px] text-zinc-500">donayan.com</div>
      </div>
      <div className="p-6" style={{ fontFamily }}>
        <div className="flex items-center gap-3">
          {branding.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={branding.logo} alt="logo" className="h-10 w-10 rounded-lg object-cover" />
          )}
          <span className="text-xl font-semibold" style={{ color: branding.brandColor }}>
            {title}
          </span>
        </div>
        <div className="mt-4 h-24 rounded-lg" style={{ background: `linear-gradient(135deg, ${branding.brandColor}33, ${branding.accentColor}33)` }} />
        <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium" style={{ background: `${branding.brandColor}22`, color: branding.brandColor }}>
          <Sparkles className="h-3 w-3" /> Featured Work
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SEO tab                                                            */
/* ------------------------------------------------------------------ */

function SeoTab({ form, set }: { form: SettingsForm; set: (k: keyof SettingsForm, v: string) => void }) {
  const titleLen = (form.seoTitle || form.siteTitle).length;
  const descLen = form.seoDescription.length;
  const words = form.seoDescription ? form.seoDescription.trim().split(/\s+/).filter(Boolean).length : 0;
  const score = computeSeoScore(form);
  const scoreTone = score >= 80 ? "green" : score >= 50 ? "yellow" : "red";

  return (
    <div className="space-y-6">
      <SectionCard
        title="SEO Score"
        description="Live health of your search presence."
        icon={Search}
        action={<div className="text-3xl font-bold" style={{ color: scoreColor(score) }}>{score}</div>}
      >
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: scoreColor(score) }} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Title" value={`${titleLen}`} max="60" ok={titleLen >= 30 && titleLen <= 60} />
          <Metric label="Description" value={`${descLen}`} max="160" ok={descLen >= 120 && descLen <= 160} />
          <Metric label="Keywords" value={`${words}`} max="20" ok={words > 0} />
          <Metric label="Contact" value={form.email ? "Yes" : "No"} ok={!!form.email} />
        </div>
      </SectionCard>

      <SectionCard title="Meta" description="Titles and description used by search engines." icon={FileText}>
        <TextField label="SEO Title" icon={Type} value={form.seoTitle} onChange={(v) => set("seoTitle", v)} placeholder={form.siteTitle} maxLength={70} hint="Recommended 50–60 characters." />
        <TextArea label="SEO Description" value={form.seoDescription} onChange={(v) => set("seoDescription", v)} placeholder="A short, compelling summary for search results." rows={3} maxLength={200} hint="Recommended 120–160 characters." />
      </SectionCard>

      <div className="grid gap-6 sm:grid-cols-2">
        <SectionCard title="Google Preview" icon={Globe}>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="text-xs text-emerald-400/80">https://donayan.com</div>
            <div className="mt-1 text-lg text-[#c8a24d]">{form.seoTitle || form.siteTitle || "Your site title"}</div>
            <div className="mt-1 text-sm text-zinc-400 line-clamp-2">{form.seoDescription || "Your meta description will appear here in search results."}</div>
          </div>
        </SectionCard>

        <SectionCard title="Twitter Preview" icon={Share2}>
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40">
            <div className="flex h-28 items-center justify-center bg-zinc-800/50 text-xs text-zinc-600">OG / Twitter image</div>
            <div className="p-3">
              <div className="text-xs text-zinc-500">Donayan · donayan.com</div>
              <div className="mt-0.5 text-sm font-medium text-zinc-200">{form.seoTitle || form.siteTitle}</div>
              <div className="text-xs text-zinc-500 line-clamp-1">{form.seoDescription}</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="OpenGraph Preview" icon={ImageIcon}>
        <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/40">
          <div className="flex h-40 items-center justify-center bg-zinc-800/50 text-sm text-zinc-600">1200 × 630 social card</div>
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-500">Donayan</div>
            <div className="mt-1 text-base font-semibold text-zinc-100">{form.seoTitle || form.siteTitle}</div>
            <div className="mt-1 text-sm text-zinc-400 line-clamp-2">{form.seoDescription}</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function Metric({ label, value, max, ok }: { label: string; value: string; max?: string; ok: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{label}</span>
        <StatPill tone={ok ? "green" : "red"}>{ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}</StatPill>
      </div>
      <div className="mt-1 text-lg font-semibold text-zinc-100">
        {value}
        {max && <span className="text-xs font-normal text-zinc-600">/{max}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function computeSeoScore(form: SettingsForm): number {
  let s = 0;
  const t = (form.seoTitle || form.siteTitle).length;
  const d = form.seoDescription.length;
  s += t >= 30 && t <= 60 ? 30 : t > 0 ? 15 : 0;
  s += d >= 120 && d <= 160 ? 30 : d > 0 ? 15 : 0;
  s += form.siteTitle ? 10 : 0;
  s += form.seoDescription ? 10 : 0;
  s += form.email ? 10 : 0;
  s += form.instagram || form.linkedin || form.youtube ? 10 : 0;
  return Math.min(100, s);
}

function scoreColor(score: number) {
  return score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} d ago`;
}
