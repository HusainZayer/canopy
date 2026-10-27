"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties } from "react";

type Colors = readonly [string, string, string, string];

/**
 * Generated wallpaper designs for Backdrop's previews. All drawn in code from
 * the project palette: no images, nothing copied from real wallpapers.
 */

/** Layered dunes under a low sun. */
export function DunesWallpaper({ colors, className, style }: { colors: Colors; className?: string; style?: CSSProperties }) {
  const [c1, c2, c3, c4] = colors;
  const id = `dunes-${c1.slice(1)}`;
  return (
    <svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMid slice" className={className} style={style} aria-hidden focusable="false">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.55" stopColor={c2} />
          <stop offset="1" stopColor={c3} />
        </linearGradient>
      </defs>
      <rect width="100" height="200" fill={`url(#${id}-sky)`} />
      <circle cx="64" cy="98" r="17" fill={c4} opacity="0.95" />
      <path d="M0 120 C25 104 45 112 62 120 S90 132 100 122 V200 H0Z" fill={c3} opacity="0.85" />
      <path d="M0 140 C20 130 40 134 58 144 S88 158 100 148 V200 H0Z" fill={c2} opacity="0.9" />
      <path d="M0 162 C22 152 46 160 66 168 S92 176 100 170 V200 H0Z" fill={c1} />
    </svg>
  );
}

/** Concentric orbits, like light through a lens. */
export function OrbitWallpaper({ colors, className, style }: { colors: Colors; className?: string; style?: CSSProperties }) {
  const [c1, c2, c3, c4] = colors;
  return (
    <div
      aria-hidden
      className={className}
      style={{
        ...style,
        background: [
          `radial-gradient(circle at 50% 38%, ${c4} 0 9%, transparent 9.5%)`,
          `repeating-radial-gradient(circle at 50% 38%, transparent 0 7%, color-mix(in oklab, ${c4} 22%, transparent) 7% 7.6%)`,
          `conic-gradient(from 210deg at 50% 38%, ${c2}, ${c3}, ${c1}, ${c2})`,
        ].join(","),
      }}
    />
  );
}

/**
 * A wallpaper made for a foldable: one scene spread across both screens. As the
 * device opens (`open` 0 → 1) the sun rises from the hinge and the hills part.
 * Render it once per screen with `half` to show the left or right half.
 */
export function DuoWallpaper({ colors, open, half }: { colors: Colors; open: MotionValue<number>; half: "left" | "right" }) {
  const [c1, c2, c3, c4] = colors;
  const sunY = useTransform(open, [0, 1], [118, 52]);
  const glow = useTransform(open, [0, 1], [0.15, 0.75]);
  const leftHills = useTransform(open, [0, 1], [10, 0]);
  const rightHills = useTransform(open, [0, 1], [-10, 0]);
  const id = `duo-${c1.slice(1)}`;
  return (
    <svg
      viewBox="0 0 200 140"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-y-0 h-full w-[200%]"
      style={{ left: half === "left" ? 0 : "-100%" }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.7" stopColor={c2} />
          <stop offset="1" stopColor={c3} />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={c4} stopOpacity="0.9" />
          <stop offset="1" stopColor={c4} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="140" fill={`url(#${id}-sky)`} />
      <motion.circle cx="100" r="46" cy={sunY} fill={`url(#${id}-glow)`} style={{ opacity: glow }} />
      <motion.circle cx="100" r="15" cy={sunY} fill={c4} />
      <motion.path d="M0 96 C30 82 60 86 98 104 V140 H0Z" fill={c3} style={{ x: leftHills }} />
      <motion.path d="M200 92 C168 80 136 88 102 106 V140 H200Z" fill={c3} opacity="0.9" style={{ x: rightHills }} />
      <path d="M0 118 C50 104 80 112 100 120 S160 106 200 116 V140 H0Z" fill={c1} />
    </svg>
  );
}
