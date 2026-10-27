import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import { site } from "@/config/site";
import { projects } from "@/content/projects";
import { preferencesScript } from "@/lib/preferences-script";
import { buildThemeCss } from "@/lib/theme-css";
import { neutral } from "@/lib/tokens";
import "./globals.css";

/*
 * Both faces are free (SIL OFL) and self-hosted from app/fonts as trimmed
 * variable subsets: Bricolage keeps weight 500–700 and width 85–100 (the width
 * axis drives the hero's type motion), pinned at optical size 72.
 */
const display = localFont({
  src: "./fonts/bricolage-grotesque.woff2",
  variable: "--font-bricolage",
  weight: "500 700",
  display: "swap",
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-stretch", value: "85% 100%" }],
});

const text = localFont({
  src: "./fonts/hanken-grotesk.woff2",
  variable: "--font-hanken",
  weight: "400 700",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.statement}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.maker }],
  creator: site.maker,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: neutral.light.ground },
    { media: "(prefers-color-scheme: dark)", color: neutral.dark.ground },
  ],
  colorScheme: "light dark",
};

const themeCss = buildThemeCss(projects);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencesScript }} />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className="min-h-svh">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
