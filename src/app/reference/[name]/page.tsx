import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fnSlug } from "@/lib/fn-slug";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight, Image as ImageIcon, Link2, ListTree, Package, Play, SquareTerminal, TriangleAlert, Layers } from "lucide-react";
import type { RFunction } from "@/content/types";
import { rFunctions } from "@/content/functions";
import { CodeBlock } from "@/components/code/code-block";
import { StaticCode } from "@/components/code/static-code";
import { Markdown } from "@/components/content/markdown";
import { BookmarkButton } from "@/components/learn/lesson-shell";
import { candy, fnCategory, fnLabel, INK } from "@/components/reference/candy";
import { InlineMd } from "@/components/reference/inline-md";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return [...new Set(rFunctions.map((f) => fnSlug(f.name)))].map((name) => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const slug = (await params).name;
  const f = rFunctions.find((x) => fnSlug(x.name) === slug);
  return f ? { title: `${fnLabel(f.name)} – R function reference`, description: f.purpose } : {};
}

const cardNo = (f: RFunction) => String(rFunctions.indexOf(f) + 1).padStart(3, "0");

function SectionTitle({ id, icon, children, className }: { id: string; icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <h2 id={id} className={cn("flex items-center gap-2.5 font-display text-xl font-bold tracking-tight", className)}>
      <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--c-soft)] [&_svg]:size-5">
        {icon}
      </span>
      {children}
    </h2>
  );
}

/** The decorative "collectible card" shown in the hero. */
function HeroCard({ f }: { f: RFunction }) {
  const Icon = fnCategory(f.category).icon;
  return (
    <div aria-hidden className="relative hidden w-56 shrink-0 rotate-3 md:block">
      <div className="absolute inset-0 -rotate-6 rounded-3xl border-2 border-border bg-[var(--c-soft)]" />
      <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-[var(--shadow-pop)]">
        <div className="relative overflow-hidden bg-[var(--c)] px-4 pb-4 pt-3 text-[var(--c-fg)]">
          <div className="absolute -right-6 -top-8 size-24 rounded-full bg-white/15" />
          <div className="relative flex items-center justify-between font-display text-sm font-semibold">
            <span>R Academy</span>
            <span>#{cardNo(f)}</span>
          </div>
          <div className="relative mx-auto mt-3 grid size-20 place-items-center bg-white/90 text-[var(--c-shadow)] hex-clip [&_svg]:size-9">
            <Icon />
          </div>
        </div>
        <div className="p-4">
          <p className="truncate font-mono text-lg font-bold">{fnLabel(f.name)}</p>
          <p className={cn("mt-0.5 text-xs font-extrabold uppercase tracking-wider", INK)}>{f.category}</p>
          <div className="mt-3 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1.5 flex-1 rounded-full bg-[var(--c-soft)]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EntryBody({ f, showIntro }: { f: RFunction; showIntro: boolean }) {
  const key = `${f.package}-${fnSlug(f.name)}`;
  return (
    <div className="space-y-6">
      {showIntro && (
        <section aria-labelledby={`${key}-intro`} className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
          <h2 id={`${key}-intro`} className="flex flex-wrap items-center gap-2 font-display text-xl font-bold">
            <code className="font-mono">{fnLabel(f.name)}</code> from <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-sm"><Package className="size-4" aria-hidden />{f.package}</span>
          </h2>
          <div className="mt-2 font-semibold text-muted-foreground"><Markdown>{f.purpose}</Markdown></div>
          <StaticCode code={f.syntax} className="mt-3 rounded-2xl border-2 border-border" wrap />
          <div className="mt-3"><BookmarkButton id={`fn:${f.package}:${f.name}`} kind="function" title={`${fnLabel(f.name)}`} href={`/reference/${fnSlug(f.name)}`} /></div>
        </section>
      )}

      {/* Try it */}
      <section aria-labelledby={`${key}-try`} className="overflow-hidden rounded-3xl border-2 border-mint bg-card shadow-[var(--shadow-card)]" style={candy("mint")}>
        <div className="flex flex-wrap items-center gap-3 bg-mint-soft px-5 py-4 sm:px-6">
          <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-white shadow-[0_4px_0_var(--mint-shadow)] [&_svg]:size-5 [&_svg]:fill-current">
            <Play />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={`${key}-try`} className="font-display text-xl font-bold tracking-tight">Try it</h2>
            <p className="text-sm font-semibold text-muted-foreground">Press <strong className="text-foreground">Run</strong> to run this example with real R in your browser – then change it and run it again.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <CodeBlock code={f.example} workspace={`ref:${f.name}`} className="my-0" />
          {f.output && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-bold">
                <SquareTerminal className="size-4 text-success" aria-hidden /> Expected output
              </p>
              <pre className="code-static overflow-x-auto rounded-2xl border-2 border-border bg-console px-4 py-3 text-[13px] scrollbar-thin">{f.output}</pre>
            </div>
          )}
          {f.plot && (
            <p className="flex items-center gap-2 rounded-2xl bg-sky-soft px-4 py-3 text-sm font-semibold">
              <ImageIcon className="size-4 shrink-0 text-info" aria-hidden /> This example draws a plot – press Run to see it.
            </p>
          )}
        </div>
      </section>

      {/* Arguments */}
      <section aria-labelledby={`${key}-args`} className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
        <SectionTitle id={`${key}-args`} icon={<ListTree className={INK} />}>
          Arguments
        </SectionTitle>
        <dl className="mt-4 grid gap-2.5">
          {f.args.map((a) => (
            <div key={a.name} className="grid gap-x-4 gap-y-1.5 rounded-2xl bg-surface-2/60 p-3.5 sm:grid-cols-[minmax(7rem,auto)_1fr] sm:items-baseline">
              <dt>
                <code className={cn("inline-block rounded-lg bg-[var(--c-soft)] px-2 py-0.5 font-mono text-sm font-bold", INK)}>{a.name}</code>
              </dt>
              <dd className="min-w-0 text-[15px]">
                <Markdown runnableCode={false}>{a.description}</Markdown>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Common mistakes */}
      {f.mistakes.length > 0 && (
        <section aria-labelledby={`${key}-mistakes`}>
          <h2 id={`${key}-mistakes`} className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight">
            <span aria-hidden className="grid size-9 place-items-center rounded-xl bg-sun text-[#3b2600] shadow-[0_3px_0_var(--sun-shadow)]">
              <TriangleAlert className="size-5" />
            </span>
            Watch out!
          </h2>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">Common mistakes with <code className="font-mono">{fnLabel(f.name)}</code> – and how to avoid them.</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {f.mistakes.map((m, i) => (
              <li key={i} className={cn("flex gap-3 rounded-3xl border-2 border-sun/40 bg-sun-soft p-4", f.mistakes.length % 2 === 1 && i === f.mistakes.length - 1 && "md:col-span-2")}>
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-card font-display text-sm font-bold text-warning">
                  {i + 1}
                </span>
                <div className="min-w-0 text-[15px]">
                  <span className="sr-only">Mistake {i + 1}: </span>
                  <Markdown>{m}</Markdown>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default async function FunctionPage({ params }: { params: Promise<{ name: string }> }) {
  const slug = (await params).name;
  const entries = rFunctions.filter((x) => fnSlug(x.name) === slug);
  if (!entries.length) notFound();
  const f = entries[0];
  const single = entries.length === 1;
  const cat = fnCategory(f.category);
  const CatIcon = cat.icon;
  const related = [...new Set(entries.flatMap((e) => e.related))];
  const sameCategory = rFunctions.filter((x) => x.category === f.category && fnSlug(x.name) !== slug).slice(0, 8);

  return (
    <div style={candy(cat.color)}>
      {/* Hero */}
      <div className="relative overflow-hidden border-b-2 border-border" style={{ background: "linear-gradient(135deg, var(--c-soft) 0%, var(--background) 75%)" }}>
        <div className="blob -left-20 -top-24 size-72 bg-[var(--c)]" />
        <div className="relative mx-auto flex max-w-6xl items-center gap-8 px-5 py-8 sm:py-10">
          <div className="min-w-0 flex-1">
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm font-bold text-muted-foreground">
              <Link href="/reference" className="inline-flex items-center gap-1 rounded-lg px-1 hover:text-foreground">
                <ArrowLeft className="size-4" aria-hidden /> Function library
              </Link>
              <ChevronRight className="size-4" aria-hidden />
              <span>{f.category}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--c)] px-3 py-1 font-display text-sm font-semibold text-[var(--c-fg)] [&_svg]:size-4">
                <CatIcon aria-hidden /> {f.category}
              </span>
              {entries.map((e) => (
                <span key={e.package} className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-2.5 py-0.5 text-sm font-bold">
                  <Package className="size-4 text-muted-foreground" aria-hidden /> package: {e.package}
                </span>
              ))}
              <span className="font-display text-sm font-semibold text-muted-foreground">
                <span className="sr-only">Card number </span>#{cardNo(f)}
              </span>
            </div>
            <h1 className="mt-3 break-words text-4xl font-bold sm:text-5xl">
              <code className="font-mono tracking-tight">{fnLabel(f.name)}</code>
            </h1>
            {single ? (
              <>
                <div className="mt-3 max-w-3xl text-lg font-semibold text-muted-foreground">
                  <Markdown>{f.purpose}</Markdown>
                </div>
                <div className="mt-5 max-w-3xl">
                  <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Syntax</p>
                  <StaticCode code={f.syntax} className="rounded-2xl border-2 border-border shadow-[var(--shadow-card)]" wrap />
                </div>
                <div className="mt-4">
                  <BookmarkButton id={`fn:${f.package}:${f.name}`} kind="function" title={`${fnLabel(f.name)}`} href={`/reference/${fnSlug(f.name)}`} />
                </div>
              </>
            ) : (
              <p className="mt-3 text-lg font-semibold text-muted-foreground">There are {entries.length} functions with this name, in different packages.</p>
            )}
          </div>
          <HeroCard f={f} />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-10">
          {entries.map((e) => (
            <article key={e.package} aria-label={`${fnLabel(e.name)} from package ${e.package}`}>
              <EntryBody f={e} showIntro={!single} />
            </article>
          ))}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          {related.length > 0 && (
            <section aria-labelledby="related" className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <SectionTitle id="related" icon={<Link2 className={INK} />} className="text-lg">
                Related functions
              </SectionTitle>
              <ul className="mt-4 flex flex-wrap gap-2">
                {related.map((r) => {
                  const target = rFunctions.find((x) => x.name === r);
                  const rc = fnCategory(target?.category ?? "");
                  return (
                    <li key={r}>
                      <Link
                        href={`/reference/${fnSlug(r)}`}
                        style={candy(rc.color)}
                        className="press inline-flex items-center gap-1.5 rounded-full border-2 border-transparent bg-[var(--c-soft)] px-3 py-1 font-mono text-sm font-bold [--press-shadow:color-mix(in_srgb,var(--c)_40%,transparent)] hover:border-[var(--c)]"
                      >
                        <span aria-hidden className="size-2 rounded-full bg-[var(--c)]" />
                        {fnLabel(r)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {sameCategory.length > 0 && (
            <section aria-labelledby="more" className="rounded-3xl border-2 border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <SectionTitle id="more" icon={<Layers className={INK} />} className="text-lg">
                More {f.category}
              </SectionTitle>
              <ul className="mt-3 space-y-1">
                {sameCategory.map((x) => (
                  <li key={`${x.package}-${x.name}`}>
                    <Link href={`/reference/${fnSlug(x.name)}`} className="group flex items-start gap-2 rounded-2xl px-2.5 py-2 hover:bg-[var(--c-soft)]">
                      <span className="min-w-0 flex-1">
                        <code className="block font-mono text-sm font-bold">{fnLabel(x.name)}</code>
                        <span className="line-clamp-1 text-xs font-semibold text-muted-foreground">
                          <InlineMd>{x.purpose}</InlineMd>
                        </span>
                      </span>
                      <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/reference" className={cn("mt-3 inline-flex items-center gap-1 px-2.5 font-display text-sm font-semibold hover:underline", INK)}>
                Browse all functions <ChevronRight className="size-4" aria-hidden />
              </Link>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
