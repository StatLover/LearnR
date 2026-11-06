import type { Metadata } from "next";
import { fnSlug } from "@/lib/fn-slug";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Link2 } from "lucide-react";
import { rFunctions } from "@/content/functions";
import { CodeBlock } from "@/components/code/code-block";
import { StaticCode } from "@/components/code/static-code";
import { Markdown } from "@/components/content/markdown";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/learn/lesson-shell";

export function generateStaticParams() {
  return [...new Set(rFunctions.map((f) => fnSlug(f.name)))].map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const slug = (await params).name;
  const f = rFunctions.find((x) => fnSlug(x.name) === slug);
  return f ? { title: `${f.name}() – R function reference`, description: f.purpose } : {};
}

export default async function FunctionPage({ params }: { params: Promise<{ name: string }> }) {
  const slug = (await params).name;
  const entries = rFunctions.filter((x) => fnSlug(x.name) === slug);
  if (!entries.length) notFound();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/reference" className="hover:text-foreground">Function reference</Link>
      </nav>
      {entries.map((f) => (
        <article key={f.package} className="space-y-6">
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">{f.category}</Badge>
              <Badge variant="outline">package: {f.package}</Badge>
              <div className="ml-auto"><BookmarkButton id={`fn:${f.package}:${f.name}`} kind="function" title={`${f.name}()`} href={`/reference/${fnSlug(f.name)}`} /></div>
            </div>
            <h1 className="mt-3 font-mono text-3xl font-bold">{f.name}()</h1>
            <div className="mt-2 text-lg text-muted-foreground"><Markdown>{f.purpose}</Markdown></div>
          </header>
          <section aria-labelledby="syntax">
            <h2 id="syntax" className="mb-2 text-lg font-semibold">Syntax</h2>
            <StaticCode code={f.syntax} className="rounded-lg border border-border" />
          </section>
          <section aria-labelledby="args">
            <h2 id="args" className="mb-2 text-lg font-semibold">Arguments</h2>
            <dl className="divide-y divide-border rounded-lg border border-border">
              {f.args.map((a) => (
                <div key={a.name} className="grid gap-1 p-3 sm:grid-cols-[160px_1fr]">
                  <dt className="font-mono text-sm font-semibold">{a.name}</dt>
                  <dd className="text-sm"><Markdown runnableCode={false}>{a.description}</Markdown></dd>
                </div>
              ))}
            </dl>
          </section>
          <section aria-labelledby="example">
            <h2 id="example" className="mb-2 text-lg font-semibold">Example</h2>
            <CodeBlock code={f.example} workspace={`ref:${f.name}`} />
            {f.output && (
              <>
                <p className="mb-1 mt-3 text-sm font-semibold">Expected output</p>
                <pre className="code-static overflow-x-auto rounded-lg border border-border bg-console px-4 py-2.5 text-[13px]">{f.output}</pre>
              </>
            )}
            {f.plot && <p className="mt-2 text-sm text-muted-foreground">This example draws a plot – press Run to see it.</p>}
          </section>
          <section aria-labelledby="mistakes">
            <h2 id="mistakes" className="mb-2 flex items-center gap-2 text-lg font-semibold"><AlertTriangle className="size-5 text-warning" /> Common mistakes</h2>
            <ul className="space-y-2">
              {f.mistakes.map((m, i) => (
                <li key={i} className="rounded-lg border border-border bg-warning-soft/40 p-3 text-sm"><Markdown>{m}</Markdown></li>
              ))}
            </ul>
          </section>
          {f.related.length > 0 && (
            <section aria-labelledby="related">
              <h2 id="related" className="mb-2 flex items-center gap-2 text-lg font-semibold"><Link2 className="size-5 text-primary" /> Related functions</h2>
              <div className="flex flex-wrap gap-2">
                {f.related.map((r) => (
                  <Link key={r} href={`/reference/${fnSlug(r)}`} className="rounded-full border border-border px-3 py-1 font-mono text-sm hover:border-primary hover:bg-primary-soft">{r}()</Link>
                ))}
              </div>
            </section>
          )}
        </article>
      ))}
    </div>
  );
}
