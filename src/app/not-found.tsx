import Link from "next/link";
import { Home, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hexy } from "@/components/brand/mascot";
import { FloatingHexes } from "@/components/brand/decor";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <FloatingHexes count={8} className="bottom-auto h-[26rem]" />
      <div className="blob -left-24 top-10 size-72 bg-coral" />
      <div className="blob -right-16 top-1/3 size-64 bg-grape" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-16 text-center sm:py-24">
        <Hexy mood="oops" size={150} animate title="Hexy looking puzzled" />
        <p className="mt-6 font-display text-7xl font-bold tracking-tight text-coral sm:text-8xl" aria-hidden>
          404
        </p>
        <div className="mt-5 w-full max-w-md overflow-hidden rounded-2xl border-2 border-border bg-console text-left shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-1.5 border-b-2 border-border bg-surface-2/70 px-3 py-2" aria-hidden>
            <span className="size-2.5 rounded-full bg-coral" />
            <span className="size-2.5 rounded-full bg-sun" />
            <span className="size-2.5 rounded-full bg-mint" />
            <span className="ml-2 font-mono text-xs font-bold text-muted-foreground">R console</span>
          </div>
          <pre className="code-static overflow-x-auto px-4 py-3 text-[13px]">
            <span className="text-muted-foreground">&gt; </span>
            <span className="tok-variableName">page</span>
            {"\n"}
            <span className="font-semibold text-danger">Error: object &apos;page&apos; not found</span>
          </pre>
        </div>
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight sm:text-4xl">We couldn&apos;t find that page</h1>
        <p className="mt-3 max-w-md text-[15px] font-semibold text-muted-foreground">
          The link may be old, or the address may have a typo – R would say it is case-sensitive! Let&apos;s get you back on the map.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">
              <Home /> Go home
            </Link>
          </Button>
          <Button asChild size="lg" variant="success">
            <Link href="/learn">
              <MapIcon /> Open the map
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
