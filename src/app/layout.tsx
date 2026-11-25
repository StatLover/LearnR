import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Header, MobileNav } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { themeBootScript } from "@/lib/store/theme-script";
import { getOutline } from "@/content/outline";
import { withBase } from "@/lib/base-path";

export const metadata: Metadata = {
  title: { default: "R Academy – Learn R. Write Code. Unlock Your Potential.", template: "%s · R Academy" },
  description:
    "Learn R programming as an adventure: bite-sized interactive lessons, real R running in your browser, XP and levels, daily challenges and an Error Detective that explains R errors.",
  applicationName: "R Academy",
  icons: { icon: withBase("/icon.svg") },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#121518" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const outline = getOutline();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Providers outline={outline}>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
