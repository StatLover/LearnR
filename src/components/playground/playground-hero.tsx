import { BarChart3, Code2, Cpu, PackageOpen, Table2 } from "lucide-react";
import { Hexy } from "@/components/brand/mascot";
import { FloatingHexes } from "@/components/brand/decor";

const CHIPS = [
  { icon: Cpu, label: "Real R (webR)", cls: "bg-mint-soft text-success" },
  { icon: BarChart3, label: "Plots & charts", cls: "bg-pink-soft text-pink-shadow dark:text-pink" },
  { icon: Table2, label: "Data tables", cls: "bg-sky-soft text-info" },
  { icon: PackageOpen, label: "Packages on demand", cls: "bg-grape-soft text-grape-shadow dark:text-grape" },
];

/** Hex stickers in the hero – a nod to the R community's package stickers (decorative). */
function Sticker({ x, y, label, fill, size = 64, rotate = 0 }: { x: number; y: number; label: string; fill: string; size?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size / 64})`}>
      <path d="M32 2 L60 18 L60 50 L32 66 L4 50 L4 18 Z" transform="translate(0 4)" fill="#1b1e3d" opacity="0.15" />
      <path d="M32 2 L60 18 L60 50 L32 66 L4 50 L4 18 Z" fill={fill} stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" />
      <text x="32" y="39" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize={label.length > 3 ? 12 : 22} fill="#ffffff">
        {label}
      </text>
    </g>
  );
}

/** Compact, colourful hero for the playground. */
export function PlaygroundHero() {
  return (
    <div className="relative overflow-hidden border-b-2 border-border" style={{ background: "linear-gradient(120deg, var(--sky-soft) 0%, var(--grape-soft) 45%, var(--background) 85%)" }}>
      <FloatingHexes count={6} className="max-sm:hidden" />
      <div className="blob -right-16 -top-20 size-72" style={{ background: "var(--grape)" }} />
      <div className="relative mx-auto flex max-w-7xl items-center gap-6 px-5 py-6 sm:py-7">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sky text-white shadow-[0_4px_0_var(--sky-shadow)] max-sm:hidden [&_svg]:size-7">
          <Code2 />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-sky">Your R studio</p>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            R <span className="text-gradient">Playground</span>
          </h1>
          <p className="mt-1.5 max-w-2xl text-[15px] font-semibold text-muted-foreground">
            Write any R code, run it with <kbd className="rounded-md border-2 border-border bg-surface px-1.5 font-mono text-xs">Ctrl</kbd> +{" "}
            <kbd className="rounded-md border-2 border-border bg-surface px-1.5 font-mono text-xs">Enter</kbd> and see the console, plots, data and variables – like a mini RStudio in your browser.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {CHIPS.map(({ icon: Icon, label, cls }) => (
              <li key={label} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cls}`}>
                <Icon className="size-3.5" aria-hidden /> {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden h-36 w-72 shrink-0 md:block" aria-hidden>
          <svg viewBox="0 0 280 140" className="absolute inset-0 h-full w-full">
            <Sticker x={8} y={22} label="R" fill="#5b5bf6" size={70} rotate={-8} />
            <Sticker x={78} y={4} label="ggplot2" fill="#f2559d" size={58} rotate={6} />
            <Sticker x={86} y={72} label="dplyr" fill="#ff8433" size={56} rotate={-4} />
          </svg>
          <div className="absolute -right-1 bottom-0">
            <Hexy mood="cool" size={118} animate />
          </div>
        </div>
      </div>
    </div>
  );
}
