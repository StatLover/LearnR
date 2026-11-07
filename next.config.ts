import type { NextConfig } from "next";

/**
 * Two ways to run the site:
 *
 * 1. As a Node.js server (`next build && next start`, or a host such as
 *    Vercel). Everything works, including the AI tutor endpoints, and the
 *    security headers below are sent.
 *
 * 2. As a static export for GitHub Pages (`npm run build:pages`, used by
 *    .github/workflows/pages.yml). Set NEXT_PUBLIC_STATIC_EXPORT=true and,
 *    when the site lives in a sub-path, NEXT_PUBLIC_BASE_PATH=/LearnR. The
 *    output in `out/` is plain HTML/CSS/JS. A static host has no server, so:
 *    - the AI endpoints (named `route.server.ts`) are left out and the AI
 *      features explain that they need a server;
 *    - custom headers can't be sent, so the page is not cross-origin
 *      isolated. webR then uses its slower PostMessage channel and long-
 *      running code is stopped by restarting R (see src/lib/r/session.ts).
 */
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * Cross-origin isolation (COOP + COEP) gives the page SharedArrayBuffer,
 * which webR uses for its fastest communication channel and for
 * interrupting long-running R code (the Stop button and the time limit).
 * Without it webR falls back to a slower channel that cannot be interrupted.
 */
const securityHeaders = [
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(basePath ? { basePath } : {}),
  // Route files that need a server are named `route.server.ts`; the static export skips them.
  pageExtensions: staticExport ? ["tsx", "ts"] : ["server.ts", "tsx", "ts"],
  ...(staticExport
    ? {
        output: "export",
        // /learn/ -> learn/index.html, which every static host serves without extra configuration.
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        async headers() {
          return [
            { source: "/:path*", headers: securityHeaders },
            {
              source: "/webr/:path*",
              headers: [
                { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
                { key: "Cache-Control", value: "public, max-age=86400" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
