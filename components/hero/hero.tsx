import Link from "next/link";
import { site } from "@/config/site";
import { chapterProjects } from "@/content/projects";
import { HeroScene } from "./hero-scene";
import { HeroTitle } from "./hero-title";

export function Hero() {
  const backdrop = chapterProjects.find((p) => p.preview === "backdrop");
  const orchard = chapterProjects.find((p) => p.preview === "orchard");

  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip pt-24 pb-16 sm:pt-28 lg:pb-10">
      <div className="wrap grid min-h-[calc(100svh-7rem)] grid-cols-[minmax(0,1fr)] content-center gap-x-8 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        <div className="relative z-10 lg:col-span-7 lg:self-end">
          <HeroTitle>{site.name}</HeroTitle>
          <p className="font-display mt-4 max-w-[16ch] text-step-4 leading-[1.02] font-semibold tracking-[-0.03em] sm:mt-7">
            {site.statement}
          </p>
        </div>
        <div className="my-10 pointer-coarse:mb-28 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:my-0 lg:self-center lg:pointer-coarse:mb-0">
          <HeroScene backdrop={backdrop} orchard={orchard} />
        </div>
        <div className="relative z-10 lg:col-span-7 lg:row-start-2">
          <p className="measure text-step-1 text-muted lg:mt-6">
            Independent web apps for iPhone, iPad and Mac, made by {site.maker}.
          </p>
          <nav aria-label="Projects" className="mt-8 sm:mt-10">
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {chapterProjects.map((p) => (
                <li key={p.slug} data-project={p.slug}>
                  <Link
                    href={`#${p.slug}`}
                    className="group flex min-h-11 items-center gap-3 rounded-full bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] py-2 pr-5 pl-2 ring-1 ring-line transition-[background-color,box-shadow] hover:bg-surface hover:shadow-[0_10px_24px_-16px_var(--shade)]"
                  >
                    <span
                      aria-hidden
                      className="size-8 rounded-[30%] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-[-8deg]"
                      style={{ background: `linear-gradient(150deg, ${p.palette.colors[1]}, ${p.palette.colors[0]})` }}
                    />
                    <span className="flex flex-col leading-tight">
                      <span className="font-semibold">{p.name}</span>
                      <span className="text-step--1 text-muted">{p.kind}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
