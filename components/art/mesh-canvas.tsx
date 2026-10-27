"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { withAlpha } from "@/lib/color";
import { useMotionOn } from "@/lib/preferences";
import { useActiveLoop } from "@/lib/use-active-loop";

type Props = {
  /** Base colour first, then three light colours. */
  colors: readonly [string, string, string, string];
  /** Changes the composition; the same seed always draws the same wallpaper. */
  seed?: number;
  /** 0 freezes the art, 1 is the default slow drift. */
  speed?: number;
  className?: string;
};

/** Deterministic pseudo-random numbers from a seed. */
function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** CSS-only version of the same art: shown before hydration, without JS, and behind the canvas. */
export function meshFallback(colors: Props["colors"], seed = 0) {
  const r = rng(seed + 1);
  const p = () => `${Math.round(15 + r() * 70)}% ${Math.round(10 + r() * 80)}%`;
  return [
    `radial-gradient(circle at ${p()}, ${withAlpha(colors[1], 0.95)}, transparent 62%)`,
    `radial-gradient(circle at ${p()}, ${withAlpha(colors[2], 0.9)}, transparent 58%)`,
    `radial-gradient(circle at ${p()}, ${withAlpha(colors[3], 0.85)}, transparent 50%)`,
    colors[0],
  ].join(",");
}

/**
 * A slowly shifting mesh gradient, drawn with Canvas 2D at a quarter of the
 * element's size (the gradients are soft, so the GPU upscale is invisible) and
 * only while visible. Decorative: hidden from assistive technology.
 */
export function MeshCanvas({ colors, seed = 0, speed = 1, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const motionOn = useMotionOn();
  const blobs = useRef<{ ax: number; ay: number; px: number; py: number; r: number; c: string; a: number }[]>([]);

  useEffect(() => {
    const r = rng(seed + 1);
    const order = [colors[1], colors[2], colors[3], colors[1], colors[2]];
    blobs.current = order.map((c, i) => ({
      ax: 0.3 + r() * 0.5,
      ay: 0.25 + r() * 0.5,
      px: r() * Math.PI * 2,
      py: r() * Math.PI * 2,
      r: 0.32 + r() * 0.22,
      c,
      a: i < 3 ? 1 : 0.55,
    }));
  }, [colors, seed]);

  const draw = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const { width: w, height: h } = canvas;
      if (!w || !h) return;
      const time = t * 0.12 * speed + seed * 10;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = colors[0];
      ctx.fillRect(0, 0, w, h);
      const m = Math.max(w, h);
      for (const b of blobs.current) {
        const x = w * (0.5 + 0.42 * Math.sin(time * b.ax + b.px));
        const y = h * (0.5 + 0.45 * Math.cos(time * b.ay + b.py));
        const rad = m * (b.r + 0.08 * Math.sin(time * 0.7 + b.px));
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, withAlpha(b.c, b.a));
        g.addColorStop(0.35, withAlpha(b.c, b.a * 0.75));
        g.addColorStop(0.7, withAlpha(b.c, b.a * 0.22));
        g.addColorStop(1, withAlpha(b.c, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    },
    [colors, seed, speed],
  );

  // Size the canvas to a quarter of its box and draw a still frame.
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const resize = () => {
      const scale = 0.25;
      canvas.width = Math.max(24, Math.round(wrap.clientWidth * scale));
      canvas.height = Math.max(24, Math.round(wrap.clientHeight * scale));
      draw(0);
      setReady(true);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [draw]);

  const coarse = typeof window !== "undefined" && matchMedia("(pointer: coarse)").matches;
  useActiveLoop(wrapRef, draw, { enabled: motionOn && speed > 0, fps: coarse ? 30 : 60 });

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={className}
      style={{ background: meshFallback(colors, seed), overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        className="block size-full transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}
