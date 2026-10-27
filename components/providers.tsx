"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { useMotionOn } from "@/lib/preferences";

/** Lets every Motion component follow the visitor's motion choice. */
export function Providers({ children }: { children: ReactNode }) {
  const motionOn = useMotionOn();
  return <MotionConfig reducedMotion={motionOn ? "never" : "always"}>{children}</MotionConfig>;
}
