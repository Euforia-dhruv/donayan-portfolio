"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Search,
  LayoutDashboard,
  LayoutGrid,
  Library,
  Timeline,
  FileText,
  MessageSquare,
  Quote,
  Tags,
  Image as ImageIcon,
  Hash,
  Search as SeoIcon,
  Navigation,
  BarChart3,
  Settings,
  Trash2,
  Users,
  UserCircle,
  CornerDownLeft,
} from "lucide-react";

type Command = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  soon?: boolean;
};

const GROUPS: { label: string; items: Omit<Command, "group">[] }[] = [
  {
    label: "Content",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Production Wall", href: "/admin/wall", icon: LayoutGrid },
      { label: "Creative Library", href: "/admin/projects", icon: Library },
    ],
  },
  {
    label: "Studio",
    items: [
      { label: "Timeline", href: "/admin/timeline", icon: Timeline },
      { label: "About", href: "/admin/about", icon: FileText },
      { label: "Messages", href: "/admin/contact", icon: MessageSquare },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
    ],
  },
  {
    label: "Organize",
    items: [
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Tags", href: "#", icon: Hash, soon: true },
      { label: "SEO", href: "#", icon: SeoIcon, soon: true },
      { label: "Navigation", href: "#", icon: Navigation, soon: true },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Trash", href: "#", icon: Trash2, soon: true },
      { label: "Users", href: "#", icon: Users, soon: true },
      { label: "Profile", href: "#", icon: UserCircle, soon: true },
    ],
  },
];

const ALL_COMMANDS: Command[] = GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.label })),
);

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_COMMANDS.filter((c) => !c.soon);
    return ALL_COMMANDS.filter(
      (c) =>
        !c.soon &&
        (c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)),
    );
  }, [query]);

  React.useEffect(() => {
    setActive(0);
  }, [query]);

  React.useEffect(() => {
    if (open) setQuery("");
  }, [open]);

  const go = React.useCallback(
    (cmd: Command) => {
      if (cmd.soon || cmd.href === "#") return;
      onOpenChange(false);
      router.push(cmd.href);
    },
    [onOpenChange, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[20%] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search pages and actions…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            ESC
          </kbd>
        </div>
        <ScrollArea className="max-h-[360px]">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            <div className="p-2">
              {GROUPS.map((g) => {
                const items = results.filter((r) => r.group === g.label);
                if (items.length === 0) return null;
                return (
                  <div key={g.label} className="mb-1">
                    <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                      {g.label}
                    </div>
                    {items.map((cmd) => {
                      const idx = results.indexOf(cmd);
                      return (
                        <button
                          key={cmd.label}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => go(cmd)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                            idx === active
                              ? "bg-primary/15 text-foreground"
                              : "text-muted-foreground hover:bg-white/5",
                          )}
                        >
                          <cmd.icon className="h-4 w-4" />
                          <span className="flex-1 text-left">{cmd.label}</span>
                          {idx === active && (
                            <CornerDownLeft className="h-3.5 w-3.5 opacity-60" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
