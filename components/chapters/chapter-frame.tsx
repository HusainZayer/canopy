"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";

export const ProgressContext = createContext<MotionValue<number> | null>(null);

/** True when the visitor drives the preview directly (a slider), so it may move even with motion off. */
export const UserDrivenContext = createContext(false);

export function useUserDriven() {
  return useContext(UserDrivenContext);
}

/** Scroll progress through the current chapter, 0 as it enters to 1 as it leaves. */
export function useChapterProgress(): MotionValue<number> | null {
  return useContext(ProgressContext);
}

/**
 * The scroll container for one project chapter. On large screens it is taller
 * than the viewport and its content pins while the preview plays; on phones it
 * flows naturally. Exposes scroll progress to the preview through context, and
 * grows the preview from hero-miniature size as the chapter arrives.
 */
export function ChapterFrame({
  slug,
  labelledBy,
  text,
  preview,
}: {
  slug: string;
  labelledBy: string;
  text: ReactNode;
  preview: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 15%"] });
  const grow = useTransform(scrollYProgress, [0, 0.28], [0.72, 1]);
  const lift = useTransform(scrollYProgress, [0, 0.28], [70, 0]);

  return (
    <section
      ref={ref}
      id={slug}
      data-project={slug}
      data-world-trigger={slug}
      aria-labelledby={labelledBy}
      className="relative scroll-mt-0 lg:h-[230vh]"
    >
      <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-x-10 gap-y-14 py-[var(--section)] lg:sticky lg:top-0 lg:min-h-svh lg:grid-cols-12 lg:py-20">
        <div className="min-w-0 lg:col-span-5">{text}</div>
        <ProgressContext.Provider value={scrollYProgress}>
          <motion.div className="min-w-0 origin-center lg:col-span-7" style={{ scale: grow, y: lift }}>
            {preview}
          </motion.div>
        </ProgressContext.Provider>
      </div>
    </section>
  );
}

/**
 * Progress for a preview: the chapter's progress when inside a chapter,
 * otherwise the element's own pass through the viewport (project pages).
 */
export function usePreviewProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const chapter = useChapterProgress();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "end 5%"] });
  return chapter ?? scrollYProgress;
}
