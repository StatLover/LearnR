"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { candy, type Candy } from "./candy";
import { cn } from "@/lib/utils";

export interface JumpItem {
  id: string;
  label: string;
  color: Candy;
  icon?: ReactNode;
}

/**
 * Sticky, horizontally scrolling row of colourful pills that jump to sections
 * of the page. The pill of the section currently in view is highlighted.
 */
export function JumpNav({ items, label }: { items: JumpItem[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);

  // The active section is the last one whose top has scrolled past the sticky bars.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (el && el.getBoundingClientRect().top <= line) current = i.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // Keep the active pill visible inside the scrolling row.
  useEffect(() => {
    const ul = list.current;
    const a = active ? ul?.querySelector<HTMLElement>(`[data-id="${CSS.escape(active)}"]`) : null;
    if (!ul || !a) return;
    const left = a.offsetLeft - ul.offsetLeft;
    if (left < ul.scrollLeft || left + a.offsetWidth > ul.scrollLeft + ul.clientWidth) ul.scrollTo({ left: left - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label={label} className="sticky top-[var(--header-h)] z-30 border-b-2 border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 print:hidden">
      <ul ref={list} className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-2.5 no-scrollbar">
        {items.map((i) => {
          const on = active === i.id;
          return (
            <li key={i.id} className="shrink-0">
              <a
                href={`#${i.id}`}
                data-id={i.id}
                aria-current={on ? "location" : undefined}
                style={candy(i.color)}
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-3 py-1.5 font-display text-sm font-semibold transition-colors [&_svg]:size-4",
                  on ? "border-[var(--c)] bg-[var(--c)] text-[var(--c-fg)]" : "border-transparent bg-[var(--c-soft)] text-foreground hover:border-[var(--c)]",
                )}
              >
                {i.icon && <span aria-hidden className={cn("flex", !on && "text-[var(--c-ink)] dark:text-[var(--c)]")}>{i.icon}</span>}
                {i.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
