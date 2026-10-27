"use client";

import { useMotionValue } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { ProgressContext, UserDrivenContext } from "@/components/chapters/chapter-frame";

/**
 * Hosts a preview outside the home page chapters. Instead of scroll, a slider
 * drives the same progress value, so visitors can scrub through the preview at
 * their own pace with a pointer, touch or the keyboard.
 */
export function PreviewStage({ children, label, initial = 0.55 }: { children: ReactNode; label: string; initial?: number }) {
  const progress = useMotionValue(initial);
  const [value, setValue] = useState(Math.round(initial * 100));
  const id = useId();
  return (
    <div>
      <UserDrivenContext.Provider value>
        <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>
      </UserDrivenContext.Provider>
      <div className="needs-js mx-auto mt-8 flex max-w-[26rem] items-center gap-4">
        <label htmlFor={id} className="shrink-0 text-step--1 font-semibold text-muted">
          {label}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            setValue(v);
            progress.set(v / 100);
          }}
          className="h-11 w-full cursor-pointer accent-[var(--p-accent)]"
        />
      </div>
    </div>
  );
}
