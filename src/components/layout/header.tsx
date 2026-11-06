"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Bug,
  ChevronDown,
  Code2,
  Dumbbell,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Library,
  Menu,
  Monitor,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  X,
  FileText,
  BookA,
  Database,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Tooltip } from "@/components/ui/tooltip";
import { updateSettings, useSettings, type ThemePref } from "@/lib/store/settings";
import { useRSession } from "@/hooks/use-r-session";
import { rSession } from "@/lib/r/session";
import { cn } from "@/lib/utils";
import { openSearch } from "./search-dialog";

const NAV = [
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/playground", label: "Playground", icon: Code2 },
  { href: "/error-checker", label: "Error Checker", icon: Bug },
  { href: "/tutor", label: "AI Tutor", icon: Sparkles },
  { href: "/exercises", label: "Practice", icon: Dumbbell },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

const REFERENCE = [
  { href: "/reference", label: "Function Reference", icon: Library, desc: "Searchable R functions with examples" },
  { href: "/cheatsheets", label: "Cheat Sheets", icon: FileText, desc: "Quick references for everyday R" },
  { href: "/glossary", label: "Glossary", icon: BookA, desc: "Programming & statistics terms explained" },
  { href: "/datasets", label: "Datasets", icon: Database, desc: "Sample data you can use anywhere" },
  { href: "/visualize", label: "Visualization Lab", icon: BarChart3, desc: "Experiment with charts" },
];

function RStatus() {
  const s = useRSession();
  const color =
    s.status === "ready" ? "bg-success" : s.status === "busy" ? "bg-accent animate-pulse" : s.status === "loading" ? "bg-warning animate-pulse" : s.status === "error" ? "bg-danger" : "bg-muted-foreground/50";
  const label =
    s.status === "idle" ? "R not started – click to start" : s.status === "busy" ? "R is running code" : s.message;
  return (
    <Tooltip content={label}>
      <button
        onClick={() => s.status === "idle" || s.status === "error" ? void rSession.ensure().catch(() => {}) : undefined}
        className="hidden items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-surface-2 md:inline-flex cursor-pointer"
        aria-label={`R status: ${label}`}
      >
        <span className={cn("size-2 rounded-full", color)} aria-hidden />
        R
      </button>
    </Tooltip>
  );
}

function ThemeMenu() {
  const { theme } = useSettings();
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  return (
    <DropdownMenu>
      <Tooltip content="Theme">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Theme: ${theme}. Change theme`}>
            <Icon />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => updateSettings({ theme: v as ThemePref })}>
          <DropdownMenuRadioItem value="light">
            <Sun /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const refActive = REFERENCE.some((r) => active(r.href));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1600px] items-center gap-2 px-4">
        <Link href="/" className="mr-3 flex items-center gap-2 font-semibold" aria-label="R Academy home">
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-bold text-primary-foreground shadow-sm">R</span>
          <span className="hidden text-[15px] sm:inline">
            R Academy
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                active(n.href) ? "bg-primary-soft text-primary-strong dark:text-primary" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                refActive ? "bg-primary-soft text-primary-strong dark:text-primary" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              Resources <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              {REFERENCE.map((r) => (
                <DropdownMenuItem key={r.href} asChild>
                  <Link href={r.href} className="items-start">
                    <r.icon className="mt-0.5" />
                    <span>
                      <span className="block font-medium">{r.label}</span>
                      <span className="block text-xs text-muted-foreground">{r.desc}</span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={openSearch}
            className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted-foreground hover:text-foreground sm:flex cursor-pointer"
            aria-label="Search the site (Ctrl+K)"
          >
            <Search className="size-4" />
            <span className="hidden xl:inline">Search lessons, functions…</span>
            <kbd className="hidden rounded border border-border bg-card px-1.5 font-mono text-[11px] xl:inline">Ctrl K</kbd>
          </button>
          <Button variant="ghost" size="icon" className="sm:hidden" onClick={openSearch} aria-label="Search">
            <Search />
          </Button>
          <RStatus />
          <ThemeMenu />
          <Tooltip content="Dashboard">
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link href="/dashboard" aria-label="Dashboard">
                <LayoutDashboard />
              </Link>
            </Button>
          </Tooltip>
          <Tooltip content="Settings">
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link href="/settings" aria-label="Settings">
                <Settings />
              </Link>
            </Button>
          </Tooltip>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden">
          <ul className="grid gap-1 sm:grid-cols-2">
            {[...NAV, ...REFERENCE, { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, { href: "/settings", label: "Settings", icon: Settings }, { href: "/resources", label: "All resources", icon: BookOpen }].map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium", active(n.href) ? "bg-primary-soft text-primary-strong dark:text-primary" : "hover:bg-surface-2")}
                >
                  <n.icon className="size-4 text-muted-foreground" /> {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
