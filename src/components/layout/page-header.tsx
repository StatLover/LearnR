import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Colourful page hero used at the top of every main page: a soft gradient
 * band with decorative blobs, an icon tile, the title and an optional
 * illustration / actions on the right.
 */
export function PageHeader({
  title,
  description,
  icon,
  children,
  className,
  color = "primary",
  eyebrow,
  art,
}: {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Accent colour name: primary, mint, sun, coral, sky, grape, tangerine, pink, teal */
  color?: string;
  eyebrow?: string;
  /** Illustration shown on the right (e.g. the mascot). */
  art?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden border-b-2 border-border", className)} style={{ background: `linear-gradient(135deg, var(--${color}-soft) 0%, var(--background) 70%)` }}>
      <div className="blob -left-16 -top-24 size-72" style={{ background: `var(--${color})` }} />
      <div className="blob -right-10 top-10 size-56" style={{ background: "var(--pink)", opacity: 0.18 }} />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-5 px-5 py-9 sm:py-12">
        {icon && (
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-[0_4px_0_var(--press-shadow)] [&_svg]:size-7" style={{ background: `var(--${color})`, ["--press-shadow" as string]: `var(--${color}-shadow, var(--primary-shadow))` }}>
            {icon}
          </div>
        )}
        {/* On phones the text takes the full width (icon above, actions below) instead of being squeezed. */}
        <div className="min-w-0 flex-1 basis-full sm:basis-0">
          {eyebrow && <p className="font-display text-sm font-semibold uppercase tracking-wider" style={{ color: `var(--${color})` }}>{eyebrow}</p>}
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {description && <div className="mt-2 max-w-3xl text-[15px] font-semibold text-muted-foreground">{description}</div>}
        </div>
        {children}
        {art && <div className="hidden shrink-0 md:block">{art}</div>}
      </div>
    </div>
  );
}
