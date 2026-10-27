"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Runs `frame(timeSeconds)` on requestAnimationFrame only while the element is
 * near the viewport, the tab is visible and `enabled` is true. Optionally caps
 * the frame rate (phones get 30fps for ambient art). Returns nothing; draw in
 * the callback.
 */
export function useActiveLoop(
  ref: RefObject<Element | null>,
  frame: (t: number) => void,
  { enabled = true, fps = 60 }: { enabled?: boolean; fps?: number } = {},
) {
  const frameRef = useRef(frame);
  useEffect(() => {
    frameRef.current = frame;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let raf = 0;
    let visible = false;
    let last = 0;
    const minDelta = 1000 / fps - 1;
    const start = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < minDelta) return;
      last = now;
      frameRef.current((now - start) / 1000);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        run();
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", run);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
    };
  }, [ref, enabled, fps]);
}
