"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  Film,
  Upload,
  Trash2,
  Plus,
  Save,
  Type,
  AlignLeft,
  Tags,
  BarChart3,
  Sparkles,
} from "lucide-react";

type Stat = { value: string; label: string };

type HeroForm = {
  headline: string;
  freelance: string;
  role1: string;
  role2: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: Stat[];
  availableFor: string[];
  bgPhotoId: Id<"_storage"> | null;
  bgVideoId: Id<"_storage"> | null;
};

const EMPTY: HeroForm = {
  headline: "",
  freelance: "",
  role1: "",
  role2: "",
  description: "",
  ctaPrimary: "",
  ctaSecondary: "",
  stats: [],
  availableFor: [],
  bgPhotoId: null,
  bgVideoId: null,
};

export default function HeroEditor() {
  const hero = useQuery(api.hero.get);
  const update = useMutation(api.hero.update);
  const removeMedia = useMutation(api.hero.removeMedia);
  const generateUploadUrl = useMutation(api.hero.generateUploadUrl);

  const [form, setForm] = React.useState<HeroForm>(EMPTY);
  const [loaded, setLoaded] = React.useState<HeroForm>(EMPTY);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [videoPreview, setVideoPreview] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const photoInput = React.useRef<HTMLInputElement>(null);
  const videoInput = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (hero) {
      const next: HeroForm = {
        headline: hero.headline ?? "",
        freelance: hero.freelance ?? "",
        role1: hero.role1 ?? "",
        role2: hero.role2 ?? "",
        description: hero.description ?? "",
        ctaPrimary: hero.ctaPrimary ?? "",
        ctaSecondary: hero.ctaSecondary ?? "",
        stats: hero.stats ?? [],
        availableFor: hero.availableFor ?? [],
        bgPhotoId: hero.bgPhotoId ?? null,
        bgVideoId: hero.bgVideoId ?? null,
      };
      setForm(next);
      setLoaded(next);
    }
  }, [hero]);

  const dirty = JSON.stringify(form) !== JSON.stringify(loaded);
  const photoSrc = photoPreview ?? hero?.bgPhotoUrl ?? null;
  const videoSrc = videoPreview ?? hero?.bgVideoUrl ?? null;

  const set = <K extends keyof HeroForm>(key: K, value: HeroForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const upload = async (kind: "photo" | "video", file: File) => {
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      set(kind === "photo" ? "bgPhotoId" : "bgVideoId", storageId as Id<"_storage">);
      const preview = URL.createObjectURL(file);
      if (kind === "photo") setPhotoPreview(preview);
      else setVideoPreview(preview);
      toast.success(`${kind === "photo" ? "Photo" : "Video"} selected — save to apply`);
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    }
  };

  const remove = async (kind: "photo" | "video") => {
    try {
      await removeMedia({ kind });
      set(kind === "photo" ? "bgPhotoId" : "bgVideoId", null);
      if (kind === "photo") setPhotoPreview(null);
      else setVideoPreview(null);
      toast.success(`${kind === "photo" ? "Photo" : "Video"} removed`);
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await update({
        bgPhotoId: form.bgPhotoId ?? undefined,
        bgVideoId: form.bgVideoId ?? undefined,
        headline: form.headline,
        freelance: form.freelance,
        role1: form.role1,
        role2: form.role2,
        description: form.description,
        ctaPrimary: form.ctaPrimary,
        ctaSecondary: form.ctaSecondary,
        stats: form.stats,
        availableFor: form.availableFor,
      });
      setLoaded(form);
      toast.success("Hero updated");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (hero === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-zinc-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-[#c8a24d]" />
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#c8a24d]/10 blur-3xl" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
            <Sparkles className="h-3 w-3 text-[#c8a24d]" /> Hero Section
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Edit Hero</h1>
          <p className="mt-1 text-zinc-400">Background media, headline and all hero copy.</p>
        </div>
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c8a24d] to-[#a8801f] px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#c8a24d]/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
        </button>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Background photo */}
        <Card title="Background Photo" icon={ImageIcon} desc="Shown behind the hero text.">
          <MediaTile
            kind="photo"
            src={photoSrc}
            inputRef={photoInput}
            onPick={(f) => upload("photo", f)}
            onRemove={() => remove("photo")}
            hasFile={!!form.bgPhotoId}
          />
        </Card>

        {/* Background video */}
        <Card title="Background Video" icon={Film} desc="Loops muted behind the hero text.">
          <MediaTile
            kind="video"
            src={videoSrc}
            inputRef={videoInput}
            onPick={(f) => upload("video", f)}
            onRemove={() => remove("video")}
            hasFile={!!form.bgVideoId}
            isVideo
          />
        </Card>
      </div>

      {/* Copy */}
      <Card title="Hero Copy" icon={Type} desc="Headline and role lines.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Headline (H1)" value={form.headline} onChange={(v) => set("headline", v)} placeholder="Donayan Sahdev" />
          <TextField label="Freelance label" value={form.freelance} onChange={(v) => set("freelance", v)} placeholder="Freelance" />
          <TextField label="Role line 1" value={form.role1} onChange={(v) => set("role1", v)} placeholder="Director's Assistant (DA)" />
          <TextField label="Role line 2" value={form.role2} onChange={(v) => set("role2", v)} placeholder="Creative Producer" />
        </div>
        <TextArea
          label="Description"
          value={form.description}
          onChange={(v) => set("description", v)}
          placeholder="Short intro paragraph…"
          className="mt-5"
        />
      </Card>

      {/* Buttons */}
      <Card title="Call To Action" icon={AlignLeft} desc="Hero button labels.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Primary button" value={form.ctaPrimary} onChange={(v) => set("ctaPrimary", v)} placeholder="Explore Production Log" />
          <TextField label="Secondary button" value={form.ctaSecondary} onChange={(v) => set("ctaSecondary", v)} placeholder="Work With Me" />
        </div>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Stats */}
        <Card title="Stats" icon={BarChart3} desc="Numbers shown under the hero.">
          <div className="space-y-3">
            {form.stats.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={s.value}
                  onChange={(e) => set("stats", form.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  placeholder="60+"
                  className="w-24 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#c8a24d]/50"
                />
                <input
                  value={s.label}
                  onChange={(e) => set("stats", form.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                  placeholder="Commercial Productions"
                  className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#c8a24d]/50"
                />
                <button
                  onClick={() => set("stats", form.stats.filter((_, j) => j !== i))}
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => set("stats", [...form.stats, { value: "", label: "" }])}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-[#c8a24d]/40 hover:text-[#c8a24d]"
            >
              <Plus className="h-4 w-4" /> Add stat
            </button>
          </div>
        </Card>

        {/* Available For */}
        <Card title="Available For" icon={Tags} desc="Tag chips under the stats.">
          <div className="flex flex-wrap gap-2">
            {form.availableFor.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-sm text-cinema-white/80"
              >
                {a}
                <button
                  onClick={() => set("availableFor", form.availableFor.filter((_, j) => j !== i))}
                  className="text-zinc-400 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem("tag") as HTMLInputElement);
              if (input.value.trim()) {
                set("availableFor", [...form.availableFor, input.value.trim()]);
                input.value = "";
              }
            }}
          >
            <input
              name="tag"
              placeholder="e.g. Documentary"
              className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#c8a24d]/50"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-[#c8a24d]/40 hover:text-[#c8a24d]"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  desc,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c8a24d]/20 to-fuchsia-500/10 text-[#c8a24d]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
          <p className="text-xs text-zinc-500">{desc}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-zinc-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-[#c8a24d]/50"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm text-zinc-400">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-zinc-100 outline-none transition-colors focus:border-[#c8a24d]/50"
      />
    </div>
  );
}

function MediaTile({
  kind,
  src,
  inputRef,
  onPick,
  onRemove,
  hasFile,
  isVideo,
}: {
  kind: "photo" | "video";
  src: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onPick: (file: File) => void;
  onRemove: () => void;
  hasFile: boolean;
  isVideo?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        {src ? (
          isVideo ? (
            <video src={src} className="h-full w-full object-cover" autoPlay muted loop playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <div className="text-sm text-zinc-600">No {kind} set — using default</div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/10"
        >
          <Upload className="h-4 w-4" /> {hasFile ? "Replace" : "Upload"}
        </button>
        {hasFile && (
          <button
            onClick={onRemove}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={isVideo ? "video/*" : "image/*"}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
