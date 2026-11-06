import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-mono text-sm text-danger">Error: object &apos;page&apos; not found</p>
      <h1 className="mt-3 text-3xl font-bold">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted-foreground">The link may be old, or the address may have a typo – R would say it is case-sensitive!</p>
      <div className="mt-6 flex justify-center gap-2">
        <Button asChild><Link href="/">Go home</Link></Button>
        <Button asChild variant="outline"><Link href="/learn">Learning path</Link></Button>
      </div>
    </div>
  );
}
