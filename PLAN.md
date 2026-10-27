# Canopy — build plan

## The concept, in my words

A canopy is the layer of leaves you stand under: one shelter, many branches, and light that changes colour as you walk beneath it. The site behaves the same way. The page itself is a neutral, quiet window. Each project is a small world with its own light, and as you scroll from one to the next, that light washes over the whole page: background, accent, focus rings, even the scrollbar thumb. You never leave the studio, but you always know whose world you are standing in.

The hero shows those worlds as living miniatures before you have read anything. The chapters grow them into something you can play with. The footer folds them back into a row of tiny icons, so the page closes the loop it opened.

The one memorable thing is the **light change between worlds**, with the **foldable phone opening on scroll** as the second moment of delight. Everything else stays disciplined: left-aligned type, a lot of air, no card grids for their own sake.

## Typography

| Role | Face | Why |
|---|---|---|
| Display (headings, studio name, statement) | **Bricolage Grotesque** (Google Fonts, OFL), variable `wght`, `wdth`, `opsz` | Soft ink-trap grotesque with a slightly hand-made warmth: reads "maker", not "corporation", and it is nothing like SF. The width axis is used as a quiet motion device: the studio name tightens from 100 → 88 width as the hero scrolls away, so type itself takes part in the motion. Tight tracking (−0.035em) at large sizes. |
| Text (body, UI, labels) | **Hanken Grotesk** (Google Fonts, OFL), variable `wght` | Neutral, open apertures, very legible at 15–18px, with a warmth that sits well next to Bricolage without competing. Clearly distinct: Bricolage carries personality, Hanken stays out of the way. |

Both self-hosted through `next/font/local` from `app/fonts/`, as trimmed variable subsets (Latin, Bricolage weight 500–700 and width 85–100 pinned at optical size 72: 57 KB; Hanken weight 400–700: 19 KB). `display: swap` with metric-adjusted fallbacks so there is no layout shift. (Local files rather than `next/font/google` so builds never depend on reaching Google at build time.)

Scale (fluid, ~1.25 ratio at mobile growing to ~1.414 at desktop):
`--step--1` 0.83rem · `--step-0` 1rem/1.06rem · `--step-1` 1.25rem · `--step-2` 1.6rem · `--step-3` 2.2rem · `--step-4` 3.2rem · `--step-5` 4.6rem · `--display` clamp(4.5rem, 16vw, 14rem).
Body measure capped at ~64ch. Sentence case everywhere; no all-caps eyebrows.

## Colour

A cool, faintly green-grey neutral (shade under leaves) rather than cream or pure white, so the project colours have room to arrive.

| Token | Light | Dark | Use |
|---|---|---|---|
| `ground` | `#F2F3F0` | `#18191A` | Page background (graphite, not tinted black) |
| `surface` | `#FAFAF8` | `#212324` | Raised panes, device frames |
| `ink` | `#1C1F1D` | `#ECEDE9` | Text |
| `muted` | `#575D59` | `#A4AAA6` | Secondary text (≥ 5.5:1 on ground in both themes) |
| `line` | ink at 12% | ink at 14% | Hairlines, outlines |

Projects bring their own colour. Each entry defines `accent.light`, `accent.dark` and a `palette` (`tint.light`, `tint.dark` for the page wash, plus four `colors` for its generative art).

- **Backdrop — dusk**: accent `#4F3CCF` / `#A99BFF`; tint `#ECEAF8` / `#1C1B2C`; art colours `#1E1B4B #5B47E0 #E9806E #F7C8A0`. Wallpapers live in the evening sky.
- **Orchard — grove**: accent `#1F6B45` / `#6CD49B`; tint `#E8F1EA` / `#15201A`; art colours `#0F3D2A #2E8A57 #E8B44A #F3E2B3`. Leaf green and late-summer gold, never Apple red.

Contrast is not left to taste: the Zod schema computes WCAG contrast at build time and **fails the build** if an accent is below 4.5:1 against both the neutral ground and its own tint in either theme. That guarantees the quality bar for every future project, not just these two.

## Motion principles

1. **Motion means travel.** Things move only to say "you are moving between worlds" (colour wash, miniature → preview, footer fold-back) or "this answered you" (tilt, hover, press).
2. **Scroll-linked over autoplay.** Wallpaper cross-fades, the fold, icon sorting and the release ticker are driven by scroll position, so nothing moves when the reader is still. The only ambient motion is the hero's slow drift, and it stops when offscreen, when the tab is hidden, or when motion is turned off.
3. **Physical.** Pointer and tilt go through springs (`stiffness 120, damping 20, mass 0.6`); entrances use one custom ease `cubic-bezier(.2,.7,.1,1)`, 500–900ms. No bounces on text.
4. **Cheap.** Only `transform`, `opacity` and colour transitions on a single CSS variable layer. The generative wallpaper is a Canvas 2D mesh rendered at ¼ resolution (blur hides it, the GPU upscales it), capped at 30fps on phones. No WebGL, no 3D engine: the fold is a CSS 3D `rotateY` on two panes, which is all the scene needs.
5. **Optional.** `prefers-reduced-motion` turns every movement into a still frame or a short cross-fade. There is also a visible motion switch in the header (WCAG 2.2.2 pause, stop, hide), defaulting to the system setting.

## Layout

All content left-aligned to a 12-column grid with a wide left gutter on desktop; previews hang to the right.

```
HERO (100svh)
┌─────────────────────────────────────────────┐
│ Canopy·                       [◐] [motion]  │  header: wordmark, nav, toggles
│                                             │
│ Canopy                       ┌──────┐  ▢ ▢  │  studio name, display size
│ Small, carefully made        │ mesh │ ▢  ▢  │  statement, step-4
│ things for Apple people.     │ pane │  ▢    │  miniatures float in depth
│                              └──────┘       │
│ Backdrop ↘  Orchard ↘                       │  one-click jump links
└─────────────────────────────────────────────┘

CHAPTER (desktop: 220vh tall, inner pinned; phones: natural height)
┌─────────────────────────────────────────────┐
│ Live                         ┌────┐ ┌──┬──┐ │
│ Backdrop                     │    │ │  │  │ │  phone frame + foldable
│ One-line pitch               │    │ └──┴──┘ │
│ · highlight  · highlight     └────┘         │
│ · highlight                                 │
│ [Visit Backdrop]  Read more                 │
└─────────────────────────────────────────────┘

WORKSHOP: 2–3 blurred silhouette cards in a row, codename + teaser
ABOUT: portrait-free; a large pull sentence, a paragraph, plain links
FOOTER: row of tiny icons (the miniatures, folded), © line, disclaimer
```

On phones (<768px): no pinning, previews sit below the text, parallax is replaced by gentle scroll-linked offsets, hover affordances become tap states, device tilt is offered via a small "Tilt" button only where the browser needs permission.

## Content schema (`content/projects.ts`, validated with Zod)

```ts
{
  slug: string            // kebab-case, unique
  name: string            // display name; doubles as codename in the workshop
  tagline: string         // one-line pitch, ≤ 90 chars
  description: string     // a paragraph or two for the project page
  highlights: [string, string, string]
  status: 'live' | 'beta' | 'in-progress' | 'coming-soon' | 'archived'
  url?: string            // https URL
  notifyUrl?: string      // optional "notify me" link for workshop projects
  accent: { light: hex; dark: hex }
  palette: { tint: { light: hex; dark: hex }; colors: [hex, hex, hex, hex] }
  preview: string         // key in the preview registry; unknown → generic tile
  platforms: ('iPhone' | 'iPad' | 'Mac' | 'Apple Watch' | 'Apple TV' | 'Apple Vision' | 'Web')[]
  launchDate?: 'YYYY-MM-DD'
  order: number
  featured: boolean
  next?: string[]                                    // "what's next"
  changelog?: { date: 'YYYY-MM-DD'; title: string; body?: string }[]
}
```

Routing by status: `live`/`beta` → home chapters; `in-progress`/`coming-soon` → workshop; `archived` → project page only (plus a quiet line on `/about`). Every project gets `/projects/[slug]`.

Filled-in entries:

- **Backdrop** — `live`, preview `backdrop`, platforms iPhone/iPad/Mac/Web. Tagline: "Every Apple wallpaper, at the exact size your screen wants." Highlights: the complete archive of original iPhone, iPad and Mac wallpapers; curated picks at each device's exact resolution; interactive wallpapers for iPhone Duo that react to the fold.
- **Orchard** — `beta`, preview `orchard`, platforms iPhone/iPad/Mac/Apple Watch/Apple TV/Apple Vision/Web. Tagline: "A calm place to find apps and follow everything Apple ships." Highlights: find apps and games for any Apple device; follow App Store updates and browse apps that support iPhone Duo; track every software release (public, RC and beta).
- **Workshop example** — codename `Lantern`, `in-progress`, generic preview, one-line teaser, placeholder notify link.

## Pages

`/` · `/projects/[slug]` (static params from content) · `/about` · custom 404 ("This tile wandered off"). Per-page metadata, per-page Open Graph images generated at build from each project's palette, `sitemap.xml`, `robots.txt`, JSON-LD `Organization` (home, about) and `SoftwareApplication` (project pages). Static export (`output: 'export'`) so the whole site is plain files on Vercel.

## Milestones

1. Setup, tokens, theme + motion toggles, Zod schema, site config.
2. Hero with floating miniatures and cursor/device-motion response.
3. Chapters: colour wash, Backdrop preview (phone + fold), Orchard preview (sorting tiles + release ticker).
4. Workshop, generic preview, about section, footer.
5. Project pages, about page, 404, shared-element transitions (View Transitions where supported, plain navigation elsewhere).
6. Reduced motion, mobile, accessibility, performance and SEO pass; `README.md`, `NOTES.md`; add-a-test-project check.

Each milestone: build, lint, type-check, screenshot review at 360 / 820 / 1440 in both themes and with reduced motion, commit.

## Review against "generic defaults" (what I changed)

- First instinct was a warm off-white with a serif display. Rejected: it is the most common generated look and fights the Apple-adjacent cool calm. Switched to a cool green-grey "shade" neutral and a grotesque with personality.
- First instinct for chapters was numbered "01 / 02" markers. Rejected: the projects are not a sequence. Chapters are labelled by status ("Live", "Beta"), which is real information.
- Avoided mono labels, middle-dot meta strings and arrow-suffixed links. Links say what they do: "Visit Backdrop", "Read about Orchard".
- Avoided a gradient-wash hero: the only gradients on the page are the wallpaper art itself, where they are the subject.
