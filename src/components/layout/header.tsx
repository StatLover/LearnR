"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bug,
  ChevronDown,
  Code2,
  Dumbbell,
  FlaskConical,
  Flame,
  FolderKanban,
  LayoutDashboard,
  Library,
  Map as MapIcon,
  Search,
  Settings,
  Sparkles,
  Zap,
  FileText,
  BookA,
  Database,
  Moon,
  Sun,
} from "lucide-react";
import { Hexy } from "@/components/brand/mascot";
import { Tooltip } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { useGame } from "@/components/game/outline-context";
import { useRSession } from "@/hooks/use-r-session";
import { useResolvedTheme } from "@/hooks/use-theme";
import { updateSettings } from "@/lib/store/settings";
import { cn } from "@/lib/utils";
import { openSearch } from "./search-dialog";

export const NAV = [
  { href: "/learn", label: "Learn", icon: MapIcon },
  { href: "/exercises", label: "Practice", icon: Dumbbell },
  { href: "/playground", label: "Playground", icon: Code2 },
  { href: "/error-checker", label: "Error Detective", short: "Debug", icon: Bug },
  { href: "/tutor", label: "AI Tutor", short: "Tutor", icon: Sparkles },
];

export const MORE = [
  { href: "/projects", label: "Projects", icon: FolderKanban, desc: "Guided real-world data adventures" },
  { href: "/visualize", label: "R Labs", icon: FlaskConical, desc: "Interactive simulations powered by R" },
  { href: "/reference", label: "Function Reference", icon: Library, desc: "Every function explained simply" },
  { href: "/cheatsheets", label: "Cheat Sheets", icon: FileText, desc: "Quick, copy-ready references" },
  { href: "/glossary", label: "Glossary", icon: BookA, desc: "Coding & stats words in plain English" },
  { href: "/datasets", label: "Datasets", icon: Database, desc: "Data to explore and practise with" },
];

/** True on the full-screen lesson player, where the site chrome is hidden. */
export function isFocusRoute(pathname: string) {
  return /^\/learn\/(?!module\/)[^/]+$/.test(pathname);
}

export function ThemeSwitch({ className }: { className?: string }) {
  const theme = useResolvedTheme();
  const dark = theme === "dark";
  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    updateSettings({ theme: dark ? "light" : "dark" });
    window.setTimeout(() => root.classList.remove("theme-transition"), 450);
  };
  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("relative inline-flex h-9 w-16 shrink-0 items-center rounded-full border-2 border-border bg-surface-2 p-0.5 transition-colors cursor-pointer", className)}
    >
      <Sun className={cn("absolute left-2 size-4 transition-opacity", dark ? "opacity-40" : "opacity-0")} aria-hidden />
      <Moon className={cn("absolute right-2 size-4 transition-opacity", dark ? "opacity-0" : "opacity-40")} aria-hidden />
      <span className={cn("grid size-7 place-items-center rounded-full shadow-md transition-all duration-300", dark ? "translate-x-7 bg-grape text-white" : "translate-x-0 bg-sun text-[#3b2600]")}>
        {dark ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
      </span>
    </button>
  );
}

function StatChips() {
  const g = useGame();
  return (
    <div className="flex items-center gap-1.5">
      <Tooltip content={g.streak ? `${g.streak}-day streak – keep it going!` : "Learn today to start a streak"}>
        <Link href="/dashboard" className={cn("flex h-9 items-center gap-1 rounded-xl px-2 font-display text-sm font-semibold hover:bg-surface-2", g.streak ? "text-tangerine" : "text-muted-foreground")} aria-label={`Streak: ${g.streak} days`}>
          <Flame className={cn("size-5", g.streak && "fill-current")} />
          {g.streak}
        </Link>
      </Tooltip>
      <Tooltip content={`${g.todayXp} of ${g.goalXp} XP today`}>
        <Link href="/dashboard" className="flex h-9 items-center gap-1 rounded-xl px-2 font-display text-sm font-semibold text-warning hover:bg-surface-2" aria-label={`${g.xp} XP in total`}>
          <Zap className="size-5 fill-sun text-sun" />
          {g.xp.toLocaleString()}
        </Link>
      </Tooltip>
    </div>
  );
}

function ProfileMenu() {
  const g = useGame();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group relative grid size-10 place-items-center cursor-pointer" aria-label={`Level ${g.level.level} ${g.level.title}. Open your menu`}>
        <svg viewBox="0 0 40 44" className="absolute inset-0 size-10" aria-hidden>
          <path d="M20 3 L36 12 L36 32 L20 41 L4 32 L4 12 Z" fill="var(--primary)" stroke="var(--primary-shadow)" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        <span className="relative font-display text-sm font-bold text-white">{g.level.level}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel className="px-3 py-2">
          <span className="block font-display text-base font-semibold text-foreground">Level {g.level.level} · {g.level.title}</span>
          <span className="mt-1 block h-2 overflow-hidden rounded-full bg-surface-3">
            <span className="block h-full rounded-full bg-sun" style={{ width: `${g.level.pct}%` }} />
          </span>
          <span className="mt-1 block text-xs">{(g.level.next - g.xp).toLocaleString()} XP to level {g.level.level + 1}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard"><LayoutDashboard /> My dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings"><Settings /> Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {MORE.map((m) => (
          <DropdownMenuItem key={m.href} asChild className="lg:hidden">
            <Link href={m.href}><m.icon /> {m.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RDot() {
  const s = useRSession();
  const color = s.status === "ready" ? "bg-mint" : s.status === "busy" ? "bg-sky animate-pulse" : s.status === "loading" ? "bg-sun animate-pulse" : s.status === "error" ? "bg-coral" : "bg-border-strong";
  return (
    <Tooltip content={s.status === "idle" ? "R starts when you run code" : s.status === "busy" ? "R is running your code" : s.message}>
      <span className="hidden items-center gap-1.5 rounded-xl px-2 py-1 text-xs font-bold text-muted-foreground xl:inline-flex" aria-label={`R status: ${s.message}`}>
        <span className={cn("size-2.5 rounded-full", color)} aria-hidden /> R
      </span>
    </Tooltip>
  );
}

export function Header() {
  const pathname = usePathname();
  if (isFocusRoute(pathname)) return null;
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const moreActive = MORE.some((m) => active(m.href));
  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-[var(--header-h)] max-w-[1400px] items-center gap-2 px-3 sm:px-5">
        <Link href="/" className="group mr-2 flex items-center gap-1.5" aria-label="R Academy home">
          <Hexy size={36} className="transition-transform group-hover:-rotate-6 group-hover:scale-105" />
          <span className="hidden font-display text-xl font-bold tracking-tight sm:inline">
            <span className="text-primary">R</span> Academy
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-2 font-display text-[15px] font-semibold transition-colors",
                active(n.href) ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <n.icon className="size-[18px]" aria-hidden />
              {n.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className={cn("flex items-center gap-1 rounded-xl px-3 py-2 font-display text-[15px] font-semibold cursor-pointer", moreActive ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground")}>
              More <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80">
              {MORE.map((m) => (
                <DropdownMenuItem key={m.href} asChild className="items-start py-2.5">
                  <Link href={m.href}>
                    <m.icon className="mt-0.5 text-primary" />
                    <span>
                      <span className="block">{m.label}</span>
                      <span className="block text-xs font-semibold text-muted-foreground">{m.desc}</span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button onClick={openSearch} className="flex h-9 items-center gap-2 rounded-xl px-2 text-muted-foreground hover:bg-surface-2 hover:text-foreground cursor-pointer xl:border-2 xl:border-border xl:bg-surface xl:px-3" aria-label="Search (Ctrl+K)">
            <Search className="size-[18px]" />
            <span className="hidden text-sm font-semibold xl:inline">Search</span>
            <kbd className="hidden rounded-md bg-surface-2 px-1.5 font-mono text-[11px] xl:inline">Ctrl K</kbd>
          </button>
          <RDot />
          <StatChips />
          <ThemeSwitch className="hidden sm:inline-flex" />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

/** Duolingo-style bottom tab bar on phones and small tablets. */
export function MobileNav() {
  const pathname = usePathname();
  if (isFocusRoute(pathname)) return null;
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {NAV.map((n) => (
          <li key={n.href}>
            <Link href={n.href} aria-current={active(n.href) ? "page" : undefined} className={cn("flex flex-col items-center gap-0.5 py-2 text-[11px] font-bold", active(n.href) ? "text-primary" : "text-muted-foreground")}>
              <span className={cn("grid h-8 w-12 place-items-center rounded-xl transition-colors", active(n.href) && "bg-primary-soft")}>
                <n.icon className="size-5" />
              </span>
              {n.short ?? n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
