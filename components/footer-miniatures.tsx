"use client";

import { motion } from "motion/react";
import { IconTile, ORCHARD_TONES, type GlyphName } from "@/components/art/icon-tile";
import { meshFallback } from "@/components/art/mesh-canvas";
import type { Project } from "@/content/schema";
import { useMotionOn } from "@/lib/preferences";

const TINY: { glyph: GlyphName; tone: keyof typeof ORCHARD_TONES }[] = [
  { glyph: "sun", tone: "gold" },
  { glyph: "leaf", tone: "grove" },
  { glyph: "bars", tone: "night" },
  { glyph: "spark", tone: "clay" },
  { glyph: "wave", tone: "sky" },
  { glyph: "dots", tone: "sage" },
  { glyph: "moon", tone: "cream" },
];

/**
 * The hero's miniatures, folded back into a row of tiny icons: they fall in
 * from hero size and settle into line when the footer comes into view.
 */
export function FooterMiniatures({ paneColors }: { paneColors?: Project["palette"]["colors"] }) {
  const motionOn = useMotionOn();
  const items = [
    <div
      key="pane"
      className="aspect-[9/19] w-4 rounded-[5px] ring-1 ring-line sm:w-5"
      style={{ background: paneColors ? meshFallback(paneColors, 3) : "var(--muted)" }}
    />,
    ...TINY.map((t) => <IconTile key={t.glyph} glyph={t.glyph} tone={ORCHARD_TONES[t.tone]!} className="w-6 sm:w-7" />),
  ];

  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div aria-hidden className="footer-mini flex items-end gap-2">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={motionOn ? { opacity: 0, scale: 2.6, y: -70 - (i % 3) * 16, x: (3.5 - i) * 18, rotate: (i % 2 ? 1 : -1) * 14 } : false}
            whileInView={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ type: "spring", stiffness: 110, damping: 16, mass: 0.7, delay: i * 0.06 }}
          >
            {item}
          </motion.div>
        ))}
      </div>
      <noscript>
        <style>{`.footer-mini > * { opacity: 1 !important; transform: none !important; }`}</style>
      </noscript>
      <a href="#main" className="text-link inline-flex min-h-11 items-center text-step--1 font-semibold text-muted">
        Back to the top
      </a>
    </div>
  );
}
