import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">R</span> R Academy
          </p>
          <p className="mt-2 text-muted-foreground">Learn R from zero – an interactive textbook, coding classroom and AI tutor in one place.</p>
        </div>
        <div>
          <p className="font-semibold">Learn</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/learn">Learning path</Link></li>
            <li><Link className="hover:text-foreground" href="/exercises">Exercises & challenges</Link></li>
            <li><Link className="hover:text-foreground" href="/projects">Projects</Link></li>
            <li><Link className="hover:text-foreground" href="/dashboard">Your dashboard</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Tools</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/playground">R playground</Link></li>
            <li><Link className="hover:text-foreground" href="/error-checker">Error checker</Link></li>
            <li><Link className="hover:text-foreground" href="/tutor">AI tutor</Link></li>
            <li><Link className="hover:text-foreground" href="/visualize">Visualization lab</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Reference</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li><Link className="hover:text-foreground" href="/reference">Function reference</Link></li>
            <li><Link className="hover:text-foreground" href="/cheatsheets">Cheat sheets</Link></li>
            <li><Link className="hover:text-foreground" href="/glossary">Glossary</Link></li>
            <li><Link className="hover:text-foreground" href="/datasets">Datasets</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground">
          R code runs entirely in your browser using webR (R compiled to WebAssembly) – nothing you run is sent to our server. Sample datasets are synthetic and for learning only.
        </p>
      </div>
    </footer>
  );
}
