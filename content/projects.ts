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
    tagline: "Every Apple wallpaper, at the exact size your screen wants.",
    description:
      "Backdrop is an unofficial home for Apple wallpapers. It keeps the full archive of original iPhone, iPad and Mac wallpapers, from the very first to the newest, and lets you grab each one at your device's exact resolution so nothing is stretched or cropped by accident.\n\nIt also hosts interactive wallpapers made for iPhone Duo, Apple's foldable iPhone. They are designed across both halves of the screen and respond as you open and close the fold.",
    highlights: [
      "The full archive of original iPhone, iPad and Mac wallpapers.",
      "Curated picks at each device's exact resolution.",
      "Interactive iPhone Duo wallpapers that react to the fold.",
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
      "Collections for each year's releases, side by side.",
      "A compare view to see how a wallpaper changed between generations.",
      "More interactive wallpapers for iPhone Duo.",
    ],
  },
  {
    slug: "orchard",
    name: "Orchard",
    tagline: "A calm place to find apps and follow everything Apple ships.",
    description:
      "Orchard is a quiet, minimalist web app for finding apps and games for any Apple device, without the noise of a storefront. Follow App Store updates for the apps you care about and browse apps that already support iPhone Duo.\n\nIt also tracks every software release Apple ships, across every platform, from the first beta through the release candidate to the public release, so you always know what just landed and what is coming next.",
    highlights: [
      "Find apps and games for any Apple device.",
      "Follow App Store updates and apps that support iPhone Duo.",
      "Track every Apple software release: public, RC and beta.",
    ],
    status: "beta",
    url: placeholderUrls.orchard,
    accent: { light: "#1F6B45", dark: "#6CD49B" },
    palette: {
      tint: { light: "#E8F1EA", dark: "#15201A" },
      colors: ["#0F3D2A", "#2E8A57", "#E8B44A", "#F3E2B3"],
    },
    preview: "orchard",
    platforms: ["iPhone", "iPad", "Mac", "Apple Watch", "Apple TV", "Apple Vision", "Web"],
    order: 2,
    featured: true,
    next: [
      "Personal watchlists that tell you when an app you follow updates.",
      "Release notes for each build, summarised in plain language.",
      "A dedicated iPhone Duo shelf with apps that use the fold well.",
    ],
  },
  {
    slug: "lantern",
    name: "Lantern",
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
