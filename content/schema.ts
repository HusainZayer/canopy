import { z } from "zod";
import { HEX_RE, contrast } from "@/lib/color";
import { MIN_ACCENT_CONTRAST, neutral } from "@/lib/tokens";

const hex = z.string().regex(HEX_RE, "Use a 6-digit hex colour like #4F3CCF");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const STATUSES = ["live", "beta", "in-progress", "coming-soon", "archived"] as const;
export const PLATFORMS = ["iPhone", "iPad", "Mac", "Apple Watch", "Apple TV", "Apple Vision", "Web"] as const;

export const statusLabel: Record<(typeof STATUSES)[number], string> = {
  live: "Live",
  beta: "Beta",
  "in-progress": "In progress",
  "coming-soon": "Coming soon",
  archived: "Archived",
};

export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slugs are lowercase kebab-case"),
    name: z.string().min(1).max(32),
    /** A two-to-four word description used in compact places (hero links, footer, cards). */
    kind: z.string().min(1).max(32),
    tagline: z.string().min(1).max(90),
    description: z.string().min(1),
    highlights: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
    status: z.enum(STATUSES),
    url: z.url({ protocol: /^https$/ }).optional(),
    notifyUrl: z.string().min(1).optional(),
    accent: z.object({ light: hex, dark: hex }),
    palette: z.object({
      tint: z.object({ light: hex, dark: hex }),
      colors: z.tuple([hex, hex, hex, hex]),
    }),
    /** Key in `components/previews/registry.tsx`. Unknown keys fall back to the generic tile. */
    preview: z.string().default("generic"),
    platforms: z.array(z.enum(PLATFORMS)).min(1),
    launchDate: isoDate.optional(),
    order: z.number().int(),
    featured: z.boolean().default(false),
    next: z.array(z.string().min(1)).optional(),
    changelog: z
      .array(z.object({ date: isoDate, title: z.string().min(1), body: z.string().optional() }))
      .optional(),
  })
  .superRefine((p, ctx) => {
    // Every accent must be readable on the neutral ground AND on its own tint, in both themes.
    for (const theme of ["light", "dark"] as const) {
      const accent = p.accent[theme];
      const grounds = { ground: neutral[theme].ground, tint: p.palette.tint[theme] };
      for (const [label, bg] of Object.entries(grounds)) {
        const ratio = contrast(accent, bg);
        if (ratio < MIN_ACCENT_CONTRAST) {
          ctx.addIssue({
            code: "custom",
            path: ["accent", theme],
            message: `${p.name}: ${theme} accent ${accent} is ${ratio.toFixed(2)}:1 on ${label} ${bg}; needs ${MIN_ACCENT_CONTRAST}:1`,
          });
        }
      }
      // Body text must stay readable when the page is washed in the project's tint.
      const inkRatio = contrast(neutral[theme].muted, p.palette.tint[theme]);
      if (inkRatio < MIN_ACCENT_CONTRAST) {
        ctx.addIssue({
          code: "custom",
          path: ["palette", "tint", theme],
          message: `${p.name}: muted text is ${inkRatio.toFixed(2)}:1 on the ${theme} tint; make the tint lighter/darker`,
        });
      }
    }
    if ((p.status === "live" || p.status === "beta") && !p.url) {
      ctx.addIssue({ code: "custom", path: ["url"], message: `${p.name}: live and beta projects need a url` });
    }
  });

export const projectsSchema = z
  .array(projectSchema)
  .superRefine((list, ctx) => {
    const seen = new Set<string>();
    for (const p of list) {
      if (seen.has(p.slug)) ctx.addIssue({ code: "custom", message: `Duplicate slug "${p.slug}"` });
      seen.add(p.slug);
    }
  });

export type ProjectInput = z.input<typeof projectSchema>;
export type Project = z.output<typeof projectSchema>;
export type ProjectStatus = Project["status"];
