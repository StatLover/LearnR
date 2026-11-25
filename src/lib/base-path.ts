/**
 * The site can be served from a sub-path, e.g. GitHub Pages serves this
 * repository at https://<user>.github.io/LearnR/. Next.js adds that prefix to
 * <Link>, router navigation and its own assets automatically, but not to
 * plain URLs such as fetch() calls, download links or the webR runtime – use
 * `withBase()` for those.
 *
 * Set NEXT_PUBLIC_BASE_PATH (e.g. "/LearnR") at build time; it is empty when
 * the site is served from the domain root.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/** Prefix a root-relative URL ("/data/x.csv") with the base path. */
export function withBase(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
