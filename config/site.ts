/**
 * Studio-wide settings. Anything marked PLACEHOLDER needs a real value before
 * launch; they are all listed in NOTES.md.
 */

export const site = {
  name: "Canopy",
  maker: "Husain Zayer",
  statement: "Small, carefully made things for Apple people.",
  description:
    "Canopy is the independent studio of Husain Zayer, making calm, carefully crafted web apps for Apple enthusiasts: Backdrop and Orchard.",

  /**
   * Production origin, used for canonical URLs, sitemap and Open Graph.
   * Set NEXT_PUBLIC_SITE_URL once you have a custom domain; until then Vercel
   * builds use the project's production .vercel.app address automatically.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://canopy.example.com"),

  /** PLACEHOLDER: contact address. */
  email: "hello@canopy.example.com",

  /** PLACEHOLDER: set to a newsletter or waitlist URL to enable "Notify me" links by default. */
  newsletterUrl: "https://canopy.example.com/newsletter",

  social: [
    /** PLACEHOLDER handles */
    { label: "GitHub", href: "https://github.com/your-handle" },
    { label: "X", href: "https://x.com/your-handle" },
    { label: "Threads", href: "https://www.threads.net/@your-handle" },
  ],

  /** Cookieless analytics. Off by default; set to true after adding @vercel/analytics. */
  analytics: false,

  disclaimer:
    "Canopy and its projects are independent and are not affiliated with, endorsed by or sponsored by Apple Inc. Apple, iPhone, iPad, Mac and App Store are trademarks of Apple Inc.",
} as const;

/** Live project URLs, referenced from content/projects.ts. */
export const placeholderUrls = {
  backdrop: "https://backdrop-liard.vercel.app",
  orchard: "https://orchard-mu-snowy.vercel.app",
} as const;

export type Site = typeof site;

/** True for values still set to a placeholder (example.com addresses or "your-handle"). */
export const isPlaceholder = (value?: string | null) => !value || /example\.com|your-handle/.test(value);

/** Only the links that are real, so the live site never shows a dead end. */
export const liveSocial = site.social.filter((s) => !isPlaceholder(s.href));
export const liveEmail = isPlaceholder(site.email) ? null : site.email;
export const liveNewsletterUrl = isPlaceholder(site.newsletterUrl) ? null : site.newsletterUrl;
