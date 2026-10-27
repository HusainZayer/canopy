import Link from "next/link";
import { CanopyMark } from "@/components/canopy-mark";
import { FooterMiniatures } from "@/components/footer-miniatures";
import { site } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="pt-6 pb-10 sm:pt-10">
      <div className="wrap">
        <FooterMiniatures />
        <div className="mt-12 flex flex-col gap-8 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-display text-step-1 font-semibold tracking-[-0.03em]">
            <CanopyMark className="size-6" />
            {site.name}
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-muted">
              <li>
                <Link className="text-link inline-flex min-h-11 items-center" href="/#work">
                  Work
                </Link>
              </li>
              <li>
                <Link className="text-link inline-flex min-h-11 items-center" href="/#workshop">
                  Workshop
                </Link>
              </li>
              <li>
                <Link className="text-link inline-flex min-h-11 items-center" href="/about">
                  About
                </Link>
              </li>
              <li>
                <a className="text-link inline-flex min-h-11 items-center" href={`mailto:${site.email}`}>
                  Email
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-8 grid gap-3 text-step--1 text-muted sm:grid-cols-[auto_1fr] sm:gap-10">
          <p>
            &copy; {year} {site.name}. Made by {site.maker}.
          </p>
          <p className="max-w-[70ch] sm:justify-self-end sm:text-right">{site.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
