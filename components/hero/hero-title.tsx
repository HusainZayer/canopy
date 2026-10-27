"use client";

import { motion, useScroll, useTransform } from "motion/react";

/** The studio name. Its width axis narrows as the hero scrolls away, so the type itself moves. */
export function HeroTitle({ children }: { children: string }) {
  const { scrollY } = useScroll();
  const stretch = useTransform(scrollY, [0, 600], [100, 85], { clamp: true });
  const fontStretch = useTransform(stretch, (v) => `${v}%`);
  return (
    <motion.h1
      id="hero-title"
      className="text-display -ml-[0.04em] leading-[0.82] font-bold tracking-[-0.05em]"
      style={{ fontStretch }}
    >
      {children}
    </motion.h1>
  );
}
