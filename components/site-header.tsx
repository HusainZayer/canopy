import Link from "next/link";
import { site } from "@/config/site";
import { CanopyMark } from "./canopy-mark";
import { HeaderSurface } from "./header-surface";
import { ThemeToggle } from "./preference-toggles";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <HeaderSurface />
      <div className="wrap relative flex h-16 items-center gap-4 sm:h-20">
        <Link
          href="/"
          className="font-display -ml-1 flex items-center gap-2 rounded-full px-1 text-step-1 font-semibold tracking-[-0.03em]"
          aria-label={`${site.name}, home`}
        >
          <CanopyMark className="size-6" />
          <span>{site.name}</span>
        </Link>
        <nav aria-label="Primary" className="ml-auto">
          <ul className="flex items-center gap-1 text-step--1 font-medium sm:gap-2 sm:text-step-0">
            <li>
              <Link className="rounded-full px-3 py-2 text-muted transition-colors hover:text-ink" href="/#work">
                Projects
              </Link>
            </li>
            <li className="hidden sm:block">
              <Link className="rounded-full px-3 py-2 text-muted transition-colors hover:text-ink" href="/#workshop">
                Workshop
              </Link>
            </li>
            <li>
              <Link className="rounded-full px-3 py-2 text-muted transition-colors hover:text-ink" href="/about">
                About
              </Link>
            </li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
