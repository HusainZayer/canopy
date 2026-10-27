import type { CSSProperties } from "react";

/**
 * Generic app-icon tiles: a rounded square with a soft two-tone fill and a
 * simple geometric glyph. Deliberately abstract, never a real app's icon.
 */

export const GLYPHS = {
  sun: <circle cx="12" cy="12" r="5" fill="currentColor" />,
  ring: <circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" strokeWidth="2.4" />,
  bars: (
    <g fill="currentColor">
      <rect x="6" y="11" width="3" height="7" rx="1.5" />
      <rect x="10.5" y="7" width="3" height="11" rx="1.5" />
      <rect x="15" y="9" width="3" height="9" rx="1.5" />
    </g>
  ),
  wave: (
    <path d="M4 13c2.7-4 5.3-4 8 0s5.3 4 8 0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  ),
  leaf: <path d="M6 17c0-6.5 4.5-11 12-11 0 7.5-4.5 12-11 12Z" fill="currentColor" />,
  dots: (
    <g fill="currentColor">
      <circle cx="8" cy="8" r="2" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="8" cy="16" r="2" />
      <circle cx="16" cy="16" r="2" />
    </g>
  ),
  moon: <path d="M15.5 5.5a7 7 0 1 0 3 12.4A6 6 0 0 1 15.5 5.5Z" fill="currentColor" />,
  spark: <path d="M12 4c.8 4.4 3.6 7.2 8 8-4.4.8-7.2 3.6-8 8-.8-4.4-3.6-7.2-8-8 4.4-.8 7.2-3.6 8-8Z" fill="currentColor" />,
  frame: <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2.4" />,
  play: <path d="M9 6.8v10.4a.8.8 0 0 0 1.2.7l8.3-5.2a.8.8 0 0 0 0-1.4l-8.3-5.2a.8.8 0 0 0-1.2.7Z" fill="currentColor" />,
  stack: (
    <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <path d="M12 5 4.5 9 12 13l7.5-4Z" />
      <path d="m4.5 13 7.5 4 7.5-4" />
    </g>
  ),
  arc: <path d="M5 17a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />,
} as const;

export type GlyphName = keyof typeof GLYPHS;

export type TileTone = { from: string; to: string; ink: string };

export function IconTile({
  glyph,
  tone,
  className,
  style,
}: {
  glyph: GlyphName;
  tone: TileTone;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`relative aspect-square overflow-hidden rounded-[var(--radius-tile)] ${className ?? ""}`}
      style={{
        background: `linear-gradient(155deg, ${tone.from}, ${tone.to})`,
        color: tone.ink,
        boxShadow: "inset 0 1px 0 rgb(255 255 255 / 0.28), 0 1px 2px rgb(0 0 0 / 0.08), 0 12px 24px -12px rgb(0 0 0 / 0.35)",
        ...style,
      }}
    >
      <svg viewBox="0 0 24 24" className="absolute inset-[22%]" focusable="false">
        {GLYPHS[glyph]}
      </svg>
    </div>
  );
}

/** Tile tones drawn from Orchard's grove palette, with a little range so a grid reads as many apps. */
export const ORCHARD_TONES: Record<string, TileTone> = {
  grove: { from: "#3FA06A", to: "#1F6B45", ink: "#F3FBF5" },
  gold: { from: "#F2C766", to: "#D99A2B", ink: "#3B2A07" },
  night: { from: "#1D5640", to: "#0F3D2A", ink: "#CDEBD8" },
  cream: { from: "#FBF1D6", to: "#EEDDAE", ink: "#4E3B10" },
  sage: { from: "#A9D3BA", to: "#7DB497", ink: "#163F2A" },
  clay: { from: "#F0A57E", to: "#D9734A", ink: "#3D1A0A" },
  sky: { from: "#B9D7E8", to: "#86B4CF", ink: "#16384C" },
  mist: { from: "#FFFFFF", to: "#E4E8E3", ink: "#2B4A39" },
};
