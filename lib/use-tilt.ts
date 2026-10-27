"use client";

import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useMotionOn } from "./preferences";

type OrientationCtor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/**
 * A normalised "where is the viewer looking" signal in [-1, 1] on both axes,
 * from the mouse on fine pointers and from device tilt on phones (after
 * permission where the browser asks for it). Values go through a soft spring.
 */
export function useTilt(): {
  x: MotionValue<number>;
  y: MotionValue<number>;
  canAskForTilt: boolean;
  askForTilt: () => void;
} {
  const motionOn = useMotionOn();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });
  const [canAskForTilt, setCanAskForTilt] = useState(false);
  const [listenTilt, setListenTilt] = useState(false);

  // Pointer (desktop)
  useEffect(() => {
    if (!motionOn) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const fine = matchMedia("(pointer: fine)");
    if (!fine.matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / innerWidth) * 2 - 1);
      rawY.set((e.clientY / innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [motionOn, rawX, rawY]);

  // Device orientation (phones): iOS needs a tap to grant permission; others just work.
  useEffect(() => {
    if (!motionOn || typeof DeviceOrientationEvent === "undefined") return;
    if (!matchMedia("(pointer: coarse)").matches) return;
    const ctor = DeviceOrientationEvent as OrientationCtor;
    if (typeof ctor.requestPermission === "function" && !listenTilt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after mount
      setCanAskForTilt(true);
      return;
    }
    let base: { b: number; g: number } | null = null;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      base ??= { b: e.beta, g: e.gamma };
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      rawX.set(clamp((e.gamma - base.g) / 25));
      rawY.set(clamp((e.beta - base.b) / 25));
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [motionOn, listenTilt, rawX, rawY]);

  const askForTilt = useCallback(() => {
    const ctor = DeviceOrientationEvent as OrientationCtor;
    ctor
      .requestPermission?.()
      .then((state) => {
        setCanAskForTilt(false);
        if (state === "granted") setListenTilt(true);
      })
      .catch(() => setCanAskForTilt(false));
  }, []);

  return { x, y, canAskForTilt: canAskForTilt && motionOn, askForTilt };
}
