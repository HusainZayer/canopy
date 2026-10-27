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

export function MotionToggle() {
  const on = useMotionOn();
  return (
    <button
      type="button"
      className={buttonClass}
      onClick={() => setMotion(!on)}
      aria-pressed={on}
      aria-label="Motion"
      title={on ? "Turn motion off" : "Turn motion on"}
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden focusable="false">
        <path
          d={on ? "M3 12c2.5-5 5-5 7.5 0s5 5 7.5 0c.9-1.8 1.9-3 3-3.4" : "M3 12h18"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
