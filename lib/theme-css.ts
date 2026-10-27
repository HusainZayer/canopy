import type { Project } from "@/content/schema";
import { neutral, type ThemeName } from "./tokens";

/**
 * Builds the colour CSS from tokens and project data, so colours live in one
 * place (lib/tokens.ts + content/projects.ts) and new projects need no CSS.
 *
 * - Neutral tokens on :root, for light, dark (system) and dark (forced).
 * - `[data-project="slug"]` scopes a project's own colours (--p-accent, --p-c1…4)
 *   to any element, e.g. a chapter, card or project page.
 * - `:root[data-world="slug"]` (set by the home page as you scroll) and
 *   `:root:has([data-page-world="slug"])` (project pages, works without JS)
 *   wash the whole page in that project's tint and accent.
 */

type Decls = Record<string, string>;

const block = (selector: string, decls: Decls) =>
  `${selector}{${Object.entries(decls)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;

function neutralDecls(theme: ThemeName): Decls {
  const t = neutral[theme];
  return {
    "--ground": t.ground,
    "--surface": t.surface,
    "--ink": t.ink,
    "--muted": t.muted,
    "--line": theme === "light" ? "rgb(28 31 29 / 0.12)" : "rgb(236 237 233 / 0.14)",
    "--shade": theme === "light" ? "rgb(28 31 29 / 0.08)" : "rgb(0 0 0 / 0.35)",
    "--wash": t.ground,
    "--accent": t.ink,
    "color-scheme": theme,
  };
}

function projectDecls(p: Project, theme: ThemeName): Decls {
  const [c1, c2, c3, c4] = p.palette.colors;
  return {
    "--p-accent": p.accent[theme],
    "--p-tint": p.palette.tint[theme],
    "--p-c1": c1,
    "--p-c2": c2,
    "--p-c3": c3,
    "--p-c4": c4,
  };
}

function worldDecls(p: Project, theme: ThemeName): Decls {
  return { "--wash": p.palette.tint[theme], "--accent": p.accent[theme] };
}

/** Wraps rules so they apply in dark mode, whether chosen by the system or forced. */
function dark(selectorFor: (root: string) => string[], decls: Decls): string {
  const system = selectorFor(':root:not([data-theme="light"])').join(",");
  const forced = selectorFor(':root[data-theme="dark"]').join(",");
  return `@media (prefers-color-scheme: dark){${block(system, decls)}}${block(forced, decls)}`;
}

export function buildThemeCss(projects: Project[]): string {
  const out: string[] = [];
  out.push(block(":root", neutralDecls("light")));
  out.push(dark((root) => [root], neutralDecls("dark")));

  for (const p of projects) {
    const scope = `[data-project="${p.slug}"]`;
    out.push(block(scope, projectDecls(p, "light")));
    out.push(dark((root) => [`${root} ${scope}`], projectDecls(p, "dark")));

    const world = (root: string) => [
      `${root}[data-world="${p.slug}"]`,
      `${root}:has([data-page-world="${p.slug}"])`,
    ];
    out.push(block(world(":root").join(","), worldDecls(p, "light")));
    out.push(dark(world, worldDecls(p, "dark")));
  }
  return out.join("\n");
}
