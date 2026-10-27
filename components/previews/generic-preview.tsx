"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { useRef } from "react";
import { usePreviewProgress } from "@/components/chapters/chapter-frame";
import type { Project } from "@/content/schema";
import { useMotionOn } from "@/lib/preferences";

/**
 * The fallback preview for any project without a custom one: a large tile in
 * the project's palette with its initial, turning gently with the scroll.
 */
export function GenericPreview({ project, compact = false }: { project: Project; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = usePreviewProgress(ref);
  const motionOn = useMotionOn();
  const still = useMotionValue(0.5);
  const progress = motionOn ? scroll : still;
  const rotate = useTransform(progress, [0, 1], [-8, 6]);
  const rotateY = useTransform(progress, [0, 1], [18, -18]);
  const sheen = useTransform(progress, [0, 1], ["-40%", "140%"]);
  const orbit = useTransform(progress, [0, 1], [-30, 40]);
  const [c1, c2, c3, c4] = project.palette.colors;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${project.name}: a tile in the project's colours. A full preview is coming.`}
      className={`relative mx-auto grid aspect-square w-full place-items-center [perspective:1200px] ${compact ? "max-w-[16rem]" : "max-w-[30rem]"}`}
    >
      <motion.div aria-hidden className="absolute inset-[6%] rounded-full opacity-60" style={{ rotate: orbit }}>
        <span className="absolute top-[4%] left-[18%] size-[12%] rounded-[24%]" style={{ background: c3 }} />
        <span className="absolute right-[6%] bottom-[22%] size-[9%] rounded-[24%]" style={{ background: c2 }} />
        <span className="absolute bottom-[6%] left-[30%] size-[7%] rounded-[24%]" style={{ background: c4 }} />
      </motion.div>
      <motion.div
        aria-hidden
        className="grain relative grid aspect-square w-[58%] place-items-center overflow-hidden rounded-[var(--radius-tile)] shadow-[0_40px_80px_-40px_var(--shade),0_24px_40px_-30px_rgb(0_0_0/0.45)]"
        style={{ rotate, rotateY, background: `radial-gradient(circle at 30% 20%, ${c4}, transparent 55%), linear-gradient(150deg, ${c2}, ${c1})` }}
      >
        <span className="font-display text-[clamp(4rem,14vw,9rem)] leading-none font-bold tracking-[-0.06em]" style={{ color: c4 }}>
          {project.name.charAt(0)}
        </span>
        <motion.span
          className="absolute inset-y-0 w-[45%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.22),transparent)]"
          style={{ left: sheen }}
        />
      </motion.div>
    </div>
  );
}
