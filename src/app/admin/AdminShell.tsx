"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
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
  Menu,
  X,
  Search,
  Bell,
  ExternalLink,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useConvexAuth, useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { CommandPalette } from "@/components/admin/CommandPalette";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
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

const FLAT: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

function useTitle(pathname: string) {
  const match = FLAT.find(
    (i) => i.href !== "#" && (pathname === i.href || pathname.startsWith(i.href + "/")),
  );
  return match?.label ?? "Admin";
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const me = useQuery(api.users.me);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const title = useTitle(pathname);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (isLoading || me === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          Loading…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (me?.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-3xl">
          🔒
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Admin access required</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Your account doesn’t have admin privileges. An existing admin can
            grant access from <span className="text-foreground">Settings → Team</span>,
            or have your <span className="text-foreground">role</span> set to{" "}
            <span className="font-mono text-foreground">"admin"</span> in the Convex
            dashboard.
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    );
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-sm font-black text-white shadow-lg shadow-primary/30">
          D
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight">Donayan</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Studio Console
          </div>
        </div>
      </div>

      <ScrollNav onNavigate={() => setSidebarOpen(false)} pathname={pathname} />

      <div className="border-t border-white/5 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-background text-foreground">
        <Toaster />

        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/5 bg-sidebar/60 backdrop-blur-xl lg:block">
          {SidebarContent}
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/10 bg-sidebar animate-in slide-in-from-left">
              {SidebarContent}
            </aside>
          </div>
        )}

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-background/80 px-4 backdrop-blur-xl lg:pl-64">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Donayan</span>
            <ChevronRight className="hidden h-3.5 w-3.5 sm:inline" />
            <span className="font-medium text-foreground">{title}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-muted-foreground transition-colors hover:bg-white/10"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search…</span>
              <kbd className="hidden rounded border border-white/10 bg-black/30 px-1.5 py-0.5 text-[10px] md:inline">
                ⌘K
              </kbd>
            </button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <a href="/" target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View live site</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/5 pl-1 pr-2 transition-colors hover:bg-white/10">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-fuchsia-500 text-xs font-bold text-white">
                    A
                  </span>
                  <span className="hidden text-sm font-medium sm:inline">Admin</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setPaletteOpen(true);
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  Command palette
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-300 focus:text-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main */}
        <main className="lg:pl-64">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8"
          >
            {children}
          </motion.div>
        </main>

        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </TooltipProvider>
  );
}

function ScrollNav({
  onNavigate,
  pathname,
}: {
  onNavigate: () => void;
  pathname: string;
}) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {group.label}
          </div>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive =
                item.href !== "#" &&
                (pathname === item.href || pathname.startsWith(item.href + "/"));
              const Icon = item.icon;
              if (item.soon) {
                return (
                  <div
                    key={item.label}
                    className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/40"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    <span className="ml-auto rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted-foreground/60">
                      Soon
                    </span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
