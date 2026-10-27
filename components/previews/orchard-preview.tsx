"use client";

import { LayoutGroup, motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { IconTile, ORCHARD_TONES, type GlyphName } from "@/components/art/icon-tile";
import { usePreviewProgress, useUserDriven } from "@/components/chapters/chapter-frame";
import type { Project } from "@/content/schema";
import { useMotionOn } from "@/lib/preferences";

type Category = "Productivity" | "Music" | "Games";
type App = { id: string; glyph: GlyphName; tone: keyof typeof ORCHARD_TONES; category: Category };

const CATEGORIES: Category[] = ["Productivity", "Music", "Games"];

/** Sorted order: three rows of four, one per category. */
const APPS: App[] = [
  { id: "a", glyph: "bars", tone: "night", category: "Productivity" },
  { id: "b", glyph: "frame", tone: "mist", category: "Productivity" },
  { id: "c", glyph: "stack", tone: "sky", category: "Productivity" },
  { id: "d", glyph: "dots", tone: "sage", category: "Productivity" },
  { id: "e", glyph: "spark", tone: "clay", category: "Music" },
  { id: "f", glyph: "leaf", tone: "grove", category: "Music" },
  { id: "g", glyph: "wave", tone: "cream", category: "Music" },
  { id: "h", glyph: "sun", tone: "gold", category: "Music" },
  { id: "i", glyph: "play", tone: "grove", category: "Games" },
  { id: "j", glyph: "moon", tone: "night", category: "Games" },
  { id: "k", glyph: "ring", tone: "gold", category: "Games" },
  { id: "l", glyph: "arc", tone: "clay", category: "Games" },
];

/** The same apps before Orchard tidies them. */
const SHUFFLED = ["h", "a", "j", "e", "c", "k", "f", "b", "l", "d", "i", "g"].map((id) => APPS.find((a) => a.id === id)!);

/** Loose scatter applied before sorting, in px and degrees. */
const SCATTER = [
  [-6, 10, -7], [8, -4, 5], [-10, 6, 9], [4, 12, -4], [12, -8, -9], [-4, 4, 6],
  [6, 10, 8], [-12, -6, -5], [2, -10, 4], [10, 8, -8], [-8, -2, 7], [4, -12, -6],
] as const;

type Release = { platform: string; version: string; stage: "Beta" | "RC" | "Release"; build?: string };

/** Mock data for the preview only. */
const RELEASES: Release[] = [
  { platform: "iOS", version: "27.2", stage: "Beta", build: "Beta 3" },
  { platform: "macOS", version: "27.1", stage: "Release" },
  { platform: "visionOS", version: "27.1", stage: "RC" },
  { platform: "watchOS", version: "27.2", stage: "Beta", build: "Beta 3" },
  { platform: "iPadOS", version: "27.1", stage: "Release" },
  { platform: "Xcode", version: "27.1", stage: "RC" },
  { platform: "tvOS", version: "27.2", stage: "Beta", build: "Beta 2" },
  { platform: "iOS", version: "27.1", stage: "Release" },
  { platform: "macOS", version: "27.2", stage: "Beta", build: "Beta 2" },
];

export function OrchardPreview({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = usePreviewProgress(ref);
  const systemMotion = useMotionOn();
  const userDriven = useUserDriven();
  const motionOn = systemMotion || userDriven;
  const [sortedByScroll, setSorted] = useState(false);
  const sorted = !motionOn || sortedByScroll;

  // Sort past the middle of the chapter, with a little hysteresis so it never flickers.
  useMotionValueEvent(progress, "change", (v) => {
    setSorted((s) => (s ? v > 0.36 : v > 0.42));
  });

  const order = sorted ? APPS : SHUFFLED;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${project.name} preview: app icons sorting themselves into Productivity, Music and Games, above a ticker of Apple software releases marked Beta, RC or Release.`}
      className="mx-auto w-full max-w-[38rem]"
    >
      <LayoutGroup>
        <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] items-center gap-x-[3.5%] gap-y-[3.5%] sm:gap-x-4 sm:gap-y-4">
          {CATEGORIES.map((cat, row) => (
            <Row key={cat} label={cat} visible={sorted} row={row}>
              {order.slice(row * 4, row * 4 + 4).map((app) => {
                const i = APPS.indexOf(app);
                return (
                  <ScatterTile key={app.id} app={app} index={i} progress={progress} tidy={sorted || !motionOn} />
                );
              })}
            </Row>
          ))}
        </div>
      </LayoutGroup>
      <ReleaseTicker progress={progress} motionOn={motionOn} />
    </div>
  );
}

function Row({ label, visible, row, children }: { label: string; visible: boolean; row: number; children: ReactNode }) {
  return (
    <>
      <motion.span
        aria-hidden
        className="w-[5.5rem] text-step--1 font-semibold text-p-accent sm:w-[7rem] sm:text-step-0"
        initial={false}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -8 }}
        transition={{ duration: 0.5, delay: visible ? 0.25 + row * 0.08 : 0 }}
      >
        {label}
      </motion.span>
      {children}
    </>
  );
}

function ScatterTile({ app, index, progress, tidy }: { app: App; index: number; progress: MotionValue<number>; tidy: boolean }) {
  const [sx, sy, sr] = SCATTER[index] ?? [0, 0, 0];
  const t = useTransform(progress, [0.08, 0.4], [1, 0.35]);
  const x = useTransform(t, (v) => sx * v);
  const y = useTransform(t, (v) => sy * v);
  const rotate = useTransform(t, (v) => sr * v);
  return (
    <motion.div layout layoutId={`orchard-${app.id}`} transition={{ type: "spring", stiffness: 140, damping: 22, mass: 0.8 }}>
      <motion.div
        style={tidy ? undefined : { x, y, rotate }}
        animate={tidy ? { x: 0, y: 0, rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 140, damping: 22 }}
      >
        <IconTile glyph={app.glyph} tone={ORCHARD_TONES[app.tone]!} />
      </motion.div>
    </motion.div>
  );
}

function ReleaseTicker({ progress, motionOn }: { progress: MotionValue<number>; motionOn: boolean }) {
  const x = useTransform(progress, [0, 1], ["4%", "-46%"]);
  const items = [...RELEASES, ...RELEASES];
  return (
    <div
      aria-hidden
      className="mt-8 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--surface)_75%,transparent)] py-2.5 ring-1 ring-line sm:mt-10 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <motion.ul className="flex w-max gap-2.5 px-3" style={{ x: motionOn ? x : "0%" }}>
        {items.map((r, i) => (
          <li key={i} className="flex shrink-0 items-center gap-2 rounded-full bg-surface py-1.5 pr-1.5 pl-3.5 text-step--1 ring-1 ring-line">
            <span className="font-semibold whitespace-nowrap">
              {r.platform} {r.version}
            </span>
            <StageBadge stage={r.stage} label={r.build ?? r.stage} />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

function StageBadge({ stage, label }: { stage: Release["stage"]; label: string }) {
  const style =
    stage === "Release"
      ? "bg-p-accent text-ground"
      : stage === "RC"
        ? "text-p-accent ring-1 ring-current"
        : "text-muted border border-dashed border-current/50";
  return <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold whitespace-nowrap ${style}`}>{label}</span>;
}
