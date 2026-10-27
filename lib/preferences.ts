"use client";

import { useSyncExternalStore } from "react";

import { MOTION_KEY, THEME_KEY } from "./preferences-script";

function subscribeToRoot(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion", "data-theme"] });
  const mq = matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => {
    observer.disconnect();
    mq.removeEventListener("change", callback);
  };
}

/** True when the visitor allows motion (system preference, overridable by the header switch). */
export function useMotionOn(): boolean {
  return useSyncExternalStore(
    subscribeToRoot,
    () => document.documentElement.dataset.motion !== "off",
    () => true,
  );
}

export type EffectiveTheme = "light" | "dark";

export function useEffectiveTheme(): EffectiveTheme {
  return useSyncExternalStore(
    subscribeToRoot,
    () => {
      const forced = document.documentElement.dataset.theme;
      if (forced === "light" || forced === "dark") return forced;
      return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    },
    () => "light",
  );
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage can be unavailable (private mode); the choice still applies for this visit */
  }
}

export function setTheme(theme: EffectiveTheme) {
  document.documentElement.dataset.theme = theme;
  store(THEME_KEY, theme);
}

export function setMotion(on: boolean) {
  document.documentElement.dataset.motion = on ? "on" : "off";
  store(MOTION_KEY, on ? "on" : "off");
}
