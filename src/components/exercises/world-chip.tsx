import type { World } from "@/lib/game/worlds";
import { cn } from "@/lib/utils";

/** Readable text in a world's colour, in both themes (mixed towards the foreground). */
export function worldInk(world: World) {
  return `color-mix(in srgb, ${world.color.main} 58%, var(--foreground))`;
}

/** A small hexagon in the world's colour. */
export function WorldHex({ world, className }: { world: World; className?: string }) {
  return (
    <svg viewBox="0 0 24 26" className={cn("size-3.5 shrink-0", className)} aria-hidden>
      <path d="M12 1 L23 7 L23 19 L12 25 L1 19 L1 7 Z" fill={world.color.main} stroke={world.color.shadow} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** Chip naming a learning world, tinted in the world's colour. */
export function WorldChip({ world, className, label }: { world: World; className?: string; label?: string }) {
  return (
    <span
      className={cn("inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap", className)}
      style={{ background: world.color.soft, color: worldInk(world) }}
    >
      <WorldHex world={world} />
      <span className="truncate">{label ?? `World ${world.number} · ${world.name}`}</span>
    </span>
  );
}
