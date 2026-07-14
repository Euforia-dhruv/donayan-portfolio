"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useProjects } from "@/lib/convex/site-data";
import { buildArchiveItems } from "@/lib/archive";
import ArchiveCard from "@/components/ArchiveCard";

const MediaViewer = dynamic(() => import("@/components/MediaViewer"), {
  ssr: false,
});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "commercials", label: "Commercials" },
  { key: "music-videos", label: "Music Videos" },
  { key: "brand-films", label: "Brand Films" },
  { key: "posts", label: "Posts" },
  { key: "reels", label: "Reels" },
  { key: "collaborations", label: "Collaborations" },
  { key: "viral", label: "Viral" },
  { key: "pdf", label: "PDFs" },
  { key: "images", label: "Images" },
] as const;

export default function ArchiveContent() {
  const { projects } = useProjects();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const [viewer, setViewer] = useState<number | null>(null);

  const items = useMemo(() => buildArchiveItems(projects), [projects]);

  const filtered = useMemo(() => {
    const byFilter =
      active === "all"
        ? items
        : items.filter((i) => i.filterKeys.includes(active));
    const q = query.trim().toLowerCase();
    if (!q) return byFilter;
    return byFilter.filter((i) =>
      [i.title, i.client, i.categoryLabel, i.platform, ...(i.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, active, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const f of FILTERS) {
      c[f.key] =
        f.key === "all"
          ? items.length
          : items.filter((i) => i.filterKeys.includes(f.key)).length;
    }
    return c;
  }, [items]);

  const open = useCallback(
    (i: number) => {
      const it = filtered[i];
      if (!it) return;
      // PDFs open the Google Drive document in a new tab.
      if (it.kind === "pdf" && it.source) {
        window.open(it.source, "_blank", "noopener,noreferrer");
        return;
      }
      setViewer(i);
    },
    [filtered],
  );
  const nav = useCallback((i: number) => setViewer(i), []);

  return (
    <main id="main-content" className="bg-cinema-black">
      <div className="mx-auto max-w-[1700px] px-4 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <p className="font-switzer text-caption font-[400] uppercase tracking-[0.12em] text-gold/70">
          Production Archive
        </p>
        <h1
          className="mt-3 font-switzer font-[300] leading-[0.98] tracking-[-0.03em] text-cinema-white"
          style={{ fontSize: "clamp(40px, 6vw, 88px)" }}
        >
          Everything,<br />in one place.
        </h1>
        <p className="mt-4 max-w-xl font-switzer text-body-sm font-[300] leading-[1.6] text-stone">
          Commercials, music videos, brand films, social campaigns, OTT,
          treatments, pitch decks and PPMs — every production, fully archived.
        </p>

        <div className="mt-7 max-w-md">
          <label htmlFor="archive-search" className="sr-only">
            Search the archive
          </label>
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 transition-colors focus-within:border-gold/60">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="shrink-0 text-stone"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
            <input
              id="archive-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, client, category…"
              className="w-full bg-transparent font-switzer text-body-sm text-cinema-white placeholder:text-stone/60 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="shrink-0 text-stone transition-colors hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 mt-10 border-y border-white/5 bg-cinema-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1700px] flex-wrap gap-2 px-4 py-4 sm:px-6 lg:px-10">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              data-filter={f.key}
              onClick={() => setActive(f.key)}
              className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-caption font-switzer font-[400] uppercase tracking-[0.04em] transition-all duration-300 ${
                active === f.key
                  ? "border-gold bg-gold text-cinema-black"
                  : "border-white/10 text-stone hover:border-white/30 hover:text-white"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-[10px] font-switzer ${
                  active === f.key
                    ? "bg-cinema-black/15 text-cinema-black"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1700px] px-4 py-16 sm:px-6 lg:px-10">
        {filtered.length === 0 ? (
          <p className="py-24 text-center font-switzer text-body text-stone">
            No works in this category yet.
          </p>
        ) : (
          <div
            key={active}
            className="columns-1 gap-8 [column-fill:_balance] sm:columns-2 lg:columns-3"
          >
            {filtered.map((item, i) => (
              <ArchiveCard
                key={item.id}
                item={item}
                index={i}
                onOpen={() => open(i)}
              />
            ))}
          </div>
        )}
      </div>

      {viewer !== null && filtered[viewer] && (
        <MediaViewer
          items={filtered}
          index={viewer}
          onClose={() => setViewer(null)}
          onNavigate={nav}
        />
      )}
    </main>
  );
}
