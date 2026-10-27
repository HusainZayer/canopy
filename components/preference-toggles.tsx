"use client";

import { setMotion, setTheme, useEffectiveTheme, useMotionOn } from "@/lib/preferences";

const buttonClass =
  "needs-js grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-[color-mix(in_oklab,var(--ink)_7%,transparent)] hover:text-ink";

export function ThemeToggle() {
  const theme = useEffectiveTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button type="button" className={buttonClass} onClick={() => setTheme(next)} aria-label={`Use ${next} theme`}>
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden focusable="false">
        <circle cx="12" cy="12" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 4.75a7.25 7.25 0 0 1 0 14.5Z"
          fill="currentColor"
          style={{
            transformOrigin: "12px 12px",
            transform: theme === "dark" ? "rotate(180deg)" : "none",
            transition: "transform 500ms var(--ease-out-soft)",
          }}
        />
      </svg>
    </button>
  );
}

/** A labelled on/off switch for animations, shown in the footer. */
export function MotionSwitch() {
  const on = useMotionOn();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setMotion(!on)}
      className="needs-js group inline-flex min-h-11 items-center gap-3 rounded-full text-step--1 font-semibold text-muted transition-colors hover:text-ink"
    >
      Animations
      <span
        aria-hidden
        className="relative h-6 w-10 rounded-full bg-[color-mix(in_oklab,var(--ink)_14%,transparent)] transition-colors duration-300 group-aria-checked:bg-[var(--accent)]"
      >
        <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-surface shadow-sm transition-transform duration-300 ease-[var(--ease-out-soft)] group-aria-checked:translate-x-4" />
      </span>
    </button>
  );
}
