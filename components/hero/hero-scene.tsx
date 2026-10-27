"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useRef } from "react";
import { IconTile, ORCHARD_TONES, type GlyphName } from "@/components/art/icon-tile";
import { MeshCanvas } from "@/components/art/mesh-canvas";
import type { Project } from "@/content/schema";
import { useTilt } from "@/lib/use-tilt";

type Tile = { x: number; y: number; size: number; depth: number; glyph: GlyphName; tone: keyof typeof ORCHARD_TONES };

/** Orchard's loose cluster, as percentages of the scene box. */
const TILES: Tile[] = [
  { x: 57, y: 6, size: 19, depth: 1.4, glyph: "sun", tone: "gold" },
  { x: 80, y: 20, size: 14, depth: 2.1, glyph: "leaf", tone: "grove" },
  { x: 55, y: 31, size: 16, depth: 0.9, glyph: "bars", tone: "night" },
  { x: 76, y: 44, size: 19, depth: 1.7, glyph: "spark", tone: "clay" },
  { x: 58, y: 60, size: 14, depth: 2.4, glyph: "wave", tone: "sky" },
  { x: 81, y: 70, size: 13, depth: 1.2, glyph: "dots", tone: "sage" },
  { x: 38, y: 77, size: 15, depth: 2.7, glyph: "moon", tone: "cream" },
];

function Layer({
  tiltX,
  tiltY,
  depth,
  style,
  className,
  children,
}: {
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  depth: number;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  const x = useTransform(tiltX, (v) => v * depth * 9);
  const y = useTransform(tiltY, (v) => v * depth * 7);
  return (
    <motion.div className={`absolute ${className ?? ""}`} style={{ ...style, x, y }}>
      {children}
    </motion.div>
  );
}

export function HeroScene({ backdrop, orchard }: { backdrop?: Project; orchard?: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, canAskForTilt, askForTilt } = useTilt();
  const rotateY = useTransform(x, (v) => v * 9);
  const rotateX = useTransform(y, (v) => v * -7);

  // As the hero scrolls away the scene lifts and gathers itself, ready to become the chapters.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end start"] });
  const lift = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const gather = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const meshColors = backdrop?.palette.colors ?? (["#1E1B4B", "#5B47E0", "#E9806E", "#F7C8A0"] as const);

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto aspect-[1/0.95] w-full max-w-[21rem] [perspective:1200px] sm:max-w-[28rem] lg:max-w-[34rem]"
      style={{ y: lift, scale: gather }}
    >
      {/* Backdrop: a wallpaper pane that slowly shifts */}
      <Layer tiltX={x} tiltY={y} depth={0.6} className="hero-settle" style={{ left: "4%", top: "3%", width: "45%", "--settle-x": "-18px", "--settle-y": "26px", "--settle-delay": "0ms" } as CSSProperties}>
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="hero-float [--float-dur:9s]">
          <div className="relative aspect-[9/19] rounded-[18%/8.5%] bg-surface p-[3.5%] shadow-[0_1px_0_rgb(255_255_255/0.4)_inset,0_30px_60px_-30px_var(--shade),0_18px_36px_-24px_rgb(0_0_0/0.35)] ring-1 ring-line">
            <div className="grain relative size-full overflow-hidden rounded-[15%/7%]">
              <MeshCanvas colors={meshColors} seed={3} className="absolute inset-0" />
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/0.22),transparent_40%)]" />
            </div>
          </div>
        </motion.div>
        {backdrop && <SceneLabel project={backdrop} className="-bottom-3 left-[8%]" />}
      </Layer>

      {/* Orchard: a loose cluster of app tiles that drift in and settle */}
      {TILES.map((t, i) => (
        <Layer
          key={t.glyph}
          tiltX={x}
          tiltY={y}
          depth={t.depth}
          className="hero-settle"
          style={
            {
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: `${t.size}%`,
              "--settle-x": `${(t.x - 60) * 1.6}px`,
              "--settle-y": `${40 + t.depth * 14}px`,
              "--settle-delay": `${140 + i * 70}ms`,
            } as CSSProperties
          }
        >
          <div className="hero-float" style={{ "--float-dur": `${6 + (i % 3) * 1.4}s`, "--float-delay": `${-i * 0.9}s` } as CSSProperties}>
            <IconTile glyph={t.glyph} tone={ORCHARD_TONES[t.tone]!} />
          </div>
        </Layer>
      ))}
      {orchard && (
        <Layer tiltX={x} tiltY={y} depth={1.1} className="hero-settle" style={{ left: "70%", top: "88%", "--settle-delay": "700ms" } as CSSProperties}>
          <SceneLabel project={orchard} className="" />
        </Layer>
      )}

      {canAskForTilt && (
        <button
          type="button"
          onClick={askForTilt}
          className="absolute -bottom-11 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface/80 px-4 py-2 text-step--1 font-semibold text-ink shadow-sm ring-1 ring-line backdrop-blur"
        >
          Tilt to look around
        </button>
      )}
    </motion.div>
  );
}

function SceneLabel({ project, className }: { project: Project; className: string }) {
  return (
    <span
      aria-hidden
      data-project={project.slug}
      className={`absolute whitespace-nowrap rounded-full bg-[color-mix(in_oklab,var(--surface)_82%,transparent)] px-3 py-1.5 text-step--1 font-semibold text-p-accent shadow-[0_8px_20px_-12px_var(--shade)] ring-1 ring-line backdrop-blur-md ${className}`}
    >
      {project.name}
    </span>
  );
}
