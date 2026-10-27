"use client";

import { useEffect, useState } from "react";

/**
 * The header's frosted backing. It matches the page at the top, and gains a
 * hairline once the page scrolls so content never reads through the header.
 */
export function HeaderSurface() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div
      aria-hidden
      data-scrolled={scrolled || undefined}
      className="pointer-events-none absolute inset-0 border-b border-transparent bg-[color-mix(in_oklab,var(--wash)_80%,transparent)] backdrop-blur-xl backdrop-saturate-150 transition-[border-color,background-color] duration-[var(--wash-duration)] data-[scrolled]:border-line"
    />
  );
}
