# Canopy

The home of Canopy, Husain Zayer's independent studio. Each project is its own world with its own colours, and the site is the window between them. As you scroll, the whole page takes on each project's light, and the hero's miniatures grow into previews you can play with.

Built with Next.js (App Router, static export), TypeScript (strict), Tailwind CSS v4, Motion and Zod. No server, no secrets, no tracking cookies.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000, with hot reload
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | Validates `content/projects.ts`, then writes the whole site as static files to `out/` |
| `npm start` | Serves `out/` locally on port 3000 (run `build` first) |
| `npm run typecheck` | Generates route types and runs `tsc --noEmit` |
| `npm run lint` | ESLint with zero warnings allowed |
| `npm run check` | All three: typecheck, lint, build |

## Deploy to Vercel

1. Push this folder to a GitHub, GitLab or Bitbucket repository.
2. In Vercel, choose **Add New → Project**, import the repository and keep the detected **Next.js** preset. No environment variables are needed.
3. Deploy. Every push to the main branch redeploys; pull requests get preview URLs.

Before going live, set `url` in `config/site.ts` to your real domain (canonical URLs, the sitemap and Open Graph images use it), then add that domain under **Project → Settings → Domains**. `vercel.json` makes sure the generated Open Graph images are served as PNG.

Because the site is a static export, the `out/` folder can also be hosted anywhere that serves files (Netlify, Cloudflare Pages, GitHub Pages, S3).

## Where things live

```
app/                    Routes: home, /projects/[slug], /about, 404, OG images, sitemap, robots
components/
  hero/                 Hero scene with the floating miniatures
  chapters/             Full-screen project chapters and the page colour wash
  previews/             Backdrop, Orchard and generic previews, plus the registry
  art/                  Generative wallpapers, mesh canvas and icon tiles
config/site.ts          Studio name, statement, links, email, analytics switch
content/projects.ts     Every project (the only file you edit to add one)
content/schema.ts       Zod schema, including build-time contrast checks
lib/tokens.ts           Neutral colours and motion constants
lib/og.tsx              Share card renderer
```

## Add a project

Add one entry to the `input` array in `content/projects.ts`. Nothing else is required.

```ts
{
  slug: "lantern",                    // URL: /projects/lantern
  name: "Lantern",
  kind: "Evening companion",          // 2–4 words for compact places
  tagline: "Something small and warm for the end of the day.",
  description: "A paragraph or two.\n\nBlank lines start a new paragraph.",
  highlights: ["First.", "Second.", "Third."],
  status: "in-progress",              // live | beta | in-progress | coming-soon | archived
  url: "https://lantern.example.com", // required for live and beta
  notifyUrl: "https://…",             // optional; workshop cards fall back to site.newsletterUrl
  accent: { light: "#8A4A12", dark: "#F2B36B" },
  palette: {
    tint: { light: "#F6EDE3", dark: "#231C15" },        // page wash while its chapter is in view
    colors: ["#3A2414", "#B8641E", "#F2B36B", "#FBE3C2"], // dark → light, used by the art
  },
  preview: "generic",                 // a key in the preview registry; unknown keys use the generic tile
  platforms: ["iPhone"],
  launchDate: "2026-11-01",           // optional
  order: 3,                           // whole number, lower comes first
  featured: false,
  next: ["Optional list of what's coming."],
  changelog: [{ date: "2026-11-01", title: "Launched", body: "Optional." }],
}
```

Where it shows up depends on `status`:

| Status | Home page | Own page | About page list |
|---|---|---|---|
| `live`, `beta` | A full chapter with colour wash and preview | Yes | Yes |
| `in-progress`, `coming-soon` | A blurred card in "In the workshop" | Yes | Yes |
| `archived` | Not shown | Yes | Yes |

Every project also gets an Open Graph image in its own colours and a sitemap entry.

The build checks each entry and stops with a readable message if something is wrong: a missing highlight, a bad date, a duplicate slug, a live project without a `url`, or an accent colour that falls below 4.5:1 contrast on the page background or its own tint in either theme. If an accent fails, darken the light-mode value or lighten the dark-mode value until it passes.

## Write a custom preview

New projects use the generic preview (an animated tile in the project's colours) until they have their own.

1. Create `components/previews/my-project-preview.tsx` as a client component that takes `{ project }`.
2. Drive any animation from `usePreviewProgress(ref)`, a 0–1 motion value. On the home page it follows scroll through the chapter; on the project page it follows the "explore" slider, so one component works in both places.
3. Respect motion settings: check `useMotionOn()` and `useUserDriven()` and fall back to a still frame (or a cross-fade) when motion is off and the visitor isn't scrubbing the slider. See `generic-preview.tsx` for the smallest working example.
4. Give the root `role="img"` and an `aria-label` describing what it shows, and mark purely decorative layers `aria-hidden`.
5. Register it in `components/previews/registry.tsx` and set `preview: "my-project"` in the content entry.

```tsx
const previews = {
  backdrop: BackdropPreview,
  orchard: OrchardPreview,
  "my-project": MyProjectPreview,
};
```

Optionally add a slider label for the project page in `SCRUB_LABEL` in `app/projects/[slug]/page.tsx` (it defaults to "Explore").

## Motion and accessibility

- Every animation has a still or cross-fade alternative. The site follows `prefers-reduced-motion`, and the header has a motion switch that overrides it either way.
- The hero canvas pauses when it's offscreen or the tab is hidden.
- Without JavaScript, all content and links still work; scroll-driven previews show a still frame.
- Theme follows the system setting, with a toggle in the header that remembers the visitor's choice.

## Analytics

Off by default. To use Vercel Web Analytics (cookieless), run `npm i @vercel/analytics`, render `<Analytics />` from `@vercel/analytics/next` in `app/layout.tsx` when `site.analytics` is true, set `analytics: true` in `config/site.ts`, and enable Analytics in the Vercel dashboard.

## Fonts

Bricolage Grotesque and Hanken Grotesk, both under the SIL Open Font License (see `app/fonts/LICENSE.txt`), self-hosted with `next/font/local`. Static `.woff` copies in `assets/og/` are used only to draw the share images.
