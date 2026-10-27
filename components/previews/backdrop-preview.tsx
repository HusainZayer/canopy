"use client";

import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { MeshCanvas } from "@/components/art/mesh-canvas";
import { DunesWallpaper, DuoWallpaper, OrbitWallpaper } from "@/components/art/wallpapers";
import { usePreviewProgress, useUserDriven } from "@/components/chapters/chapter-frame";
import type { Project } from "@/content/schema";
import { useMotionOn } from "@/lib/preferences";

/**
 * Backdrop's chapter preview: a phone whose wallpaper cross-fades through three
 * generated designs, and a foldable that opens and closes with the scroll while
 * one wallpaper continues across both screens.
 */
export function BackdropPreview({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = usePreviewProgress(ref);
  const motionOn = useMotionOn();
  const still = useMotionValue(0.5);
  const userDriven = useUserDriven();
  const progress = motionOn || userDriven ? scroll : still;
  const colors = project.palette.colors;

  // Wallpaper cross-fades are opacity only, so they stay on with reduced motion.
  const meshOpacity = useTransform(scroll, [0, 0.4, 0.46], [1, 1, 0]);
  const dunesOpacity = useTransform(scroll, [0.4, 0.46, 0.66, 0.72], [0, 1, 1, 0]);
  const orbitOpacity = useTransform(scroll, [0.66, 0.72], [0, 1]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${project.name} preview: a phone cycling through generated wallpapers, and a foldable phone whose wallpaper continues across both screens as it opens.`}
      className="relative mx-auto aspect-[1/1.02] w-full max-w-[40rem] sm:aspect-[1.15/1]"
    >
      {/* Phone */}
      <div className="absolute top-0 left-[2%] w-[42%] sm:w-[38%]">
        <div className="relative aspect-[9/19.2] rounded-[17%/8%] bg-surface p-[3.4%] shadow-[inset_0_1px_0_rgb(255_255_255/0.4),0_40px_80px_-40px_var(--shade),0_20px_40px_-28px_rgb(0_0_0/0.4)] ring-1 ring-line">
          <div className="grain relative size-full overflow-hidden rounded-[14.5%/6.8%]">
            <motion.div className="absolute inset-0" style={{ opacity: meshOpacity }}>
              <MeshCanvas colors={colors} seed={3} className="absolute inset-0" />
            </motion.div>
            <motion.div className="absolute inset-0" style={{ opacity: dunesOpacity }}>
              <DunesWallpaper colors={colors} className="absolute inset-0 size-full" />
            </motion.div>
            <motion.div className="absolute inset-0" style={{ opacity: orbitOpacity }}>
              <OrbitWallpaper colors={colors} className="absolute inset-0" />
            </motion.div>
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.2),transparent_38%)]" />
          </div>
        </div>
      </div>

      {/* Foldable */}
      <div className="absolute right-0 bottom-[4%] w-[60%] sm:bottom-[8%] sm:w-[58%]">
        <Foldable colors={colors} progress={progress} />
      </div>
    </div>
  );
}

function Foldable({ colors, progress }: { colors: Project["palette"]["colors"]; progress: MotionValue<number> }) {
  // 180° is closed (right screen folded over the left), 0° is fully open.
  const angle = useTransform(progress, [0.16, 0.42, 0.7, 0.95], [176, 0, 0, 120]);
  const open = useTransform(angle, [176, 0], [0, 1]);
  const rotateY = useTransform(angle, (a) => -a);
  const hingeShade = useTransform(angle, [0, 90, 176], [0, 0.35, 0.6]);
  const tilt = useTransform(angle, [0, 176], [-14, -24]);

  return (
    <div className="[perspective:1600px]">
      <motion.div className="relative" style={{ rotateX: 6, rotateY: tilt, transformStyle: "preserve-3d" }}>
        <div className="flex aspect-[1.6/1] w-full" style={{ transformStyle: "preserve-3d" }}>
          {/* Left screen (fixed) */}
          <Screen side="left">
            <DuoWallpaper colors={colors} open={open} half="left" />
            <motion.div aria-hidden className="fold-shade absolute inset-0 bg-black" style={{ opacity: hingeShade }} />
          </Screen>
          {/* Right screen (folds) */}
          <motion.div
            className="fold-hinge relative h-full w-1/2"
            style={{ rotateY, transformOrigin: "left center", transformStyle: "preserve-3d" }}
          >
            <Screen side="right" className="absolute inset-0 w-full [backface-visibility:hidden]">
              <DuoWallpaper colors={colors} open={open} half="right" />
            </Screen>
            {/* Back of the device, seen when folded */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-l-[10%] rounded-r-[4%] bg-surface ring-1 ring-line [backface-visibility:hidden]"
              style={{ transform: "rotateY(180deg)", background: "linear-gradient(140deg, var(--surface), color-mix(in oklab, var(--surface) 80%, var(--ink)))" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function Screen({ side, className, children }: { side: "left" | "right"; className?: string; children: ReactNode }) {
  return (
    <div
      className={`relative h-full w-1/2 overflow-hidden bg-surface p-[2.6%] ring-1 ring-line ${
        side === "left" ? "rounded-l-[10%] rounded-r-[2%] pr-0" : "rounded-l-[2%] rounded-r-[10%] pl-0"
      } ${className ?? ""}`}
    >
      <div className={`relative size-full overflow-hidden ${side === "left" ? "rounded-l-[8%]" : "rounded-r-[8%]"}`}>{children}</div>
    </div>
  );
}
