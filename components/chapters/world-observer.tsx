"use client";

import { useEffect } from "react";

/**
 * Washes the page in a project's colours while its chapter (any element with
 * `data-world-trigger="slug"`) crosses the middle of the viewport, by setting
 * `data-world` on <html>. The colours themselves are plain CSS (lib/theme-css.ts)
 * and blend with a CSS transition, so this component only flips one attribute.
 */
export function WorldObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const active = new Map<Element, string>();
    const update = () => {
      const last = [...active.values()].at(-1);
      if (last) root.dataset.world = last;
      else delete root.dataset.world;
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const slug = (e.target as HTMLElement).dataset.worldTrigger;
          if (!slug) continue;
          if (e.isIntersecting) active.set(e.target, slug);
          else active.delete(e.target);
        }
        update();
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    document.querySelectorAll("[data-world-trigger]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      delete root.dataset.world;
    };
  }, []);
  return null;
}
