import { placeholderUrls } from "@/config/site";
import { projectsSchema, type Project, type ProjectInput } from "./schema";

/**
 * Every project the studio makes. Add an entry here and it appears on the home
 * page (chapters for live/beta, workshop for in-progress/coming-soon), gets its
 * own page at /projects/[slug], its own Open Graph image, and a sitemap entry.
 *
 * The list is validated with Zod when the site builds: a bad colour, a missing
 * highlight or an accent with poor contrast fails the build with a clear message.
 */
const input: ProjectInput[] = [
  {
    slug: "backdrop",
    name: "Backdrop",
    kind: "Apple wallpapers",
    tagline: "Wallpapers that fit your screen exactly, on every iPhone, iPad and Mac.",
    description:
      "Backdrop is an independent home for Apple wallpapers. Pick your device, or let Backdrop recognise your screen, and every wallpaper downloads at that device's exact resolution, ready to set. The sizes come from Apple's own tech specs for 55 iPhones, 46 iPads, every Mac with a built-in display and Apple's external displays, including both screens on iPhone Duo.\n\nIt also keeps an archive of Apple's original wallpapers by year, shown as credited previews that link back to Apple's page, alongside collections grouped by look and 50 original wallpapers that are free to use. Every page is available in English and Arabic.",
    highlights: [
      "Exact-size downloads for 100+ iPhones, iPads and Macs.",
      "Apple's original wallpapers by year, credited and linked.",
      "Collections, 50 free originals, in English and Arabic.",
    ],
    status: "live",
    url: placeholderUrls.backdrop,
    accent: { light: "#4F3CCF", dark: "#A99BFF" },
    palette: {
      tint: { light: "#ECEAF8", dark: "#1C1B2C" },
      colors: ["#1E1B4B", "#5B47E0", "#E9806E", "#F7C8A0"],
    },
    preview: "backdrop",
    platforms: ["iPhone", "iPad", "Mac", "Web"],
    order: 1,
    featured: true,
    next: [
      "Interactive wallpapers for iPhone Duo that react to the fold.",
      "A generator for making your own wallpaper at your device's size.",
      "Creator packs from independent artists.",
      "A daily wallpaper picked for your device.",
    ],
    changelog: [
      {
        date: "2026-10-26",
        title: "Exact screen sizes for every device",
        body: "Resolutions for 55 iPhones, 46 iPads, every Mac display and Apple's external displays, each checked against Apple's tech specs.",
      },
      {
        date: "2026-10-27",
        title: "Browse by device and download at the exact size",
        body: "Live previews on the lock screen and home screen, with light and dark versions.",
      },
      {
        date: "2026-10-27",
        title: "Apple's originals archive and collections",
        body: "Apple's wallpapers by year as credited previews, and collections such as true black, soft gradients and nature.",
      },
      {
        date: "2026-10-27",
        title: "50 original wallpapers",
        body: "Free to use, with Patterns and Pastel filters and a phone-friendly layout.",
      },
    ],
  },
  {
    slug: "orchard",
    name: "Orchard",
    kind: "Duo apps and Apple news",
    tagline: "Find apps made for iPhone Duo and keep up with everything Apple ships.",
    description:
      "Orchard is a calm guide to everything Apple, built around iPhone Duo. Its directory covers more than 700 apps and shows how each one uses the fold: on the cover display, open like a book, half-folded like a laptop, standing in tent mode, or two apps side by side. Many carry an editor's score from hands-on use, and hand-picked collections help you choose your first apps for a new Duo.\n\nIt also follows every Apple software release, from developer beta through release candidate to the public version, with plain-language notes for each build. News, rumors marked Confirmed or Didn't happen once Apple settles them, reviews, known issues, events, prices by country and a history of every iPhone sit alongside. Orchard checks the App Store and Apple's release feed every six hours, so new versions and iPhone Duo support appear on their own.",
    highlights: [
      "700+ apps, showing how each one uses the iPhone Duo fold.",
      "Every Apple release, from beta to public, in plain language.",
      "News, rumors, reviews and events, refreshed as stories break.",
    ],
    status: "beta",
    url: placeholderUrls.orchard,
    accent: { light: "#1F6B45", dark: "#6CD49B" },
    palette: {
      tint: { light: "#E8F1EA", dark: "#15201A" },
      colors: ["#0F3D2A", "#2E8A57", "#E8B44A", "#F3E2B3"],
    },
    preview: "orchard",
    platforms: ["iPhone", "iPad", "Mac", "Web"],
    launchDate: "2026-10-26",
    order: 2,
    featured: true,
    changelog: [
      { date: "2026-10-26", title: "First hosted release" },
      {
        date: "2026-10-27",
        title: "Automatic news checks",
        body: "Apple Newsroom, Apple's developer releases and leading Apple news sites are checked every 30 minutes.",
      },
      {
        date: "2026-10-27",
        title: "A new home page and navigation",
        body: "Home, News, Devices, Duo apps and More, with a top story and one door to each section.",
      },
      { date: "2026-10-27", title: "Plain-language release notes for every build" },
      {
        date: "2026-10-27",
        title: "Buy now or wait, and This week in Apple",
        body: "Plus official prices and availability by country.",
      },
    ],
  },
  {
    slug: "lantern",
    name: "Lantern",
    kind: "Evening companion",
    tagline: "Something small and warm for the end of the day.",
    description:
      "Lantern is still being shaped in the workshop. It is a small companion for winding down in the evening, and it will be shared here when it is ready.",
    highlights: [
      "Designed for evenings first.",
      "Quiet by default.",
      "Made for iPhone and iPhone Duo.",
    ],
    status: "in-progress",
    accent: { light: "#8A4A12", dark: "#F2B36B" },
    palette: {
      tint: { light: "#F6EDE3", dark: "#231C15" },
      colors: ["#3A2414", "#B8641E", "#F2B36B", "#FBE3C2"],
    },
    preview: "generic",
    platforms: ["iPhone"],
    order: 3,
    featured: false,
  },
];

const result = projectsSchema.safeParse(input);
if (!result.success) {
  const lines = result.error.issues.map((i) => `  • ${i.path.join(".") || "projects"}: ${i.message}`);
  throw new Error(`content/projects.ts failed validation:\n${lines.join("\n")}`);
}

/** All projects, sorted by `order`. */
export const projects: Project[] = [...result.data].sort((a, b) => a.order - b.order);

export const chapterProjects = projects.filter((p) => p.status === "live" || p.status === "beta");
export const workshopProjects = projects.filter((p) => p.status === "in-progress" || p.status === "coming-soon");
export const archivedProjects = projects.filter((p) => p.status === "archived");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
