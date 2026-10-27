/**
 * Design tokens: the single source of truth for the neutral palette.
 * They are written into CSS custom properties by `lib/theme-css.ts`, and the
 * content schema checks every project accent against them for WCAG contrast.
 */

export const neutral = {
  light: {
    ground: "#F2F3F0",
    surface: "#FAFAF8",
    ink: "#1C1F1D",
    muted: "#575D59",
  },
  dark: {
    ground: "#18191A",
    surface: "#212324",
    ink: "#ECEDE9",
    muted: "#A4AAA6",
  },
} as const;

export type ThemeName = keyof typeof neutral;

/** Minimum contrast for accent text and focus rings (WCAG 2.2 AA, normal text). */
export const MIN_ACCENT_CONTRAST = 4.5;

/** Shared motion constants so springs feel the same everywhere. */
export const motion = {
  spring: { type: "spring", stiffness: 120, damping: 20, mass: 0.6 },
  softSpring: { type: "spring", stiffness: 70, damping: 18, mass: 0.9 },
  ease: [0.2, 0.7, 0.1, 1] as [number, number, number, number],
} as const;
