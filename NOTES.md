# Notes

## Placeholders to replace before launch

All of these live in `config/site.ts` unless noted.

| What | Current value | Where |
|---|---|---|
| Site URL (canonical, sitemap, OG) | `https://canopy.example.com` | `site.url` |
| Contact email | `hello@canopy.example.com` | `site.email` |
| Newsletter / waitlist for "Notify me" | `https://canopy.example.com/newsletter` | `site.newsletterUrl` |
| GitHub | `https://github.com/your-handle` | `site.social` |
| X | `https://x.com/your-handle` | `site.social` |
| Threads | `https://www.threads.net/@your-handle` | `site.social` |
| Backdrop URL | `https://backdrop.example.com` | `placeholderUrls.backdrop` |
| Orchard URL | `https://orchard.example.com` | `placeholderUrls.orchard` |
| Workshop example | "Lantern", an invented codename and teaser | `content/projects.ts` |
| Launch dates and changelogs | Not set for Backdrop or Orchard | `content/projects.ts` |
| Release ticker versions | Mock versions (iOS 27.2 Beta 3 and so on) | `components/previews/orchard-preview.tsx` |
| About copy | Written in your voice from the brief; check it sounds like you | `components/about-section.tsx`, `app/about/page.tsx` |

## Tagline options

1. **Small, carefully made things for Apple people.** (current, from the brief)
2. **Quiet tools for people who love their Apple devices.** Calmer, and says "tools" outright.
3. **Made with care, for the screens you care about.** Warmer; leans on wallpapers and apps alike.

## What changed from the brief, and why

- **Fold model and wallpapers are CSS/SVG, not WebGL.** A CSS 3D `rotateY` on two panes is all the fold needs, so no 3D engine. Only the hero's mesh is a canvas (Canvas 2D at quarter resolution, paused offscreen and when the tab is hidden).
- **Chapters pin only on wide screens.** On phones they scroll naturally, with gentle scroll-linked offsets instead of pinning.
- **Device tilt needs a tap on iOS.** Safari only allows motion sensors after a permission prompt, so phones that need it show a small "Tilt to look around" button instead of asking on load.
- **Project pages use a slider instead of scroll.** The previews are driven by the same 0–1 value, so on project pages a labelled range input ("Open the fold", "Sort the apps") lets people scrub at their own pace with touch, pointer or keyboard.
- **Without JavaScript**, previews show a still frame (the fold open, the app grid at rest) and every link and heading is present.

## Quality checks run (milestone 6)

- `npm run check`: zero type, lint or build errors; content validation passes.
- axe-core (WCAG 2.0/2.1/2.2 A and AA) on every page at 360px and 1440px, light and dark, scrolled through each section: no violations.
- Lighthouse mobile (simulated slow 4G, gzip on): home 92 performance and 100 for accessibility, best practices and SEO; Backdrop page 95 / 100 / 100 / 100. CLS is 0 on both.
- Real paint timing with a 4× slower CPU: the hero statement paints at about 0.6s.
- Added a beta and a coming-soon test project with no other code changes: the beta became a chapter with the generic preview, the other landed in the workshop, and both got pages, OG images and sitemap entries. Both were removed afterwards.

Lighthouse's simulated LCP on the home page (about 3s) is higher than the real measurement because it models the time to download and run the JavaScript for the hero, chapters and previews. If the score drifts under 90 as projects are added, the first lever is loading each chapter's preview only when it nears the viewport.

## Ideas for later

- A short "now playing" strip in the hero showing the latest Orchard release or newest Backdrop wallpaper, built from a JSON file at build time.
- Real wallpaper thumbnails in the Backdrop preview once there's a licence-safe set of your own originals.
- A changelog RSS feed generated from each project's `changelog`.
- Lazy-load chapter previews to keep the home page fast as the studio grows.
- A press kit page with the mark, colours and screenshots.
- Swap the "Notify me" link for a tiny email form once a newsletter provider is chosen (it can stay cookieless).
