import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { SocialLinks } from "@/components/social-links";
import { StatusBadge } from "@/components/status-badge";
import { site } from "@/config/site";
import { projects } from "@/content/projects";
import { JsonLd, organizationLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About",
  description: `${site.maker} on why ${site.name} exists, how the work gets made, and everything the studio has shipped so far.`,
  alternates: { canonical: "/about" },
  openGraph: { title: `About ${site.name}`, url: "/about" },
};

const PRINCIPLES = [
  {
    title: "Small on purpose",
    body: "Each project does one thing and tries to do it beautifully. If a feature makes it louder without making it better, it waits.",
  },
  {
    title: "Details first",
    body: "Exact resolutions, honest release dates, motion that means something. The details are the product.",
  },
  {
    title: "Yours, not mine",
    body: "No tracking cookies, no dark patterns, no accounts you don't need. The projects are independent and answer only to the people who use them.",
  },
];

export default function AboutPage() {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <main id="main" className="pt-28 sm:pt-36">
        <JsonLd data={organizationLd} />
        <div className="wrap">
          <h1 className="text-step-5 font-bold tracking-[-0.045em] sm:text-[clamp(3.5rem,2rem+6vw,8rem)]">About</h1>
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-12 lg:grid-cols-12">
            <p className="font-display max-w-[20ch] text-step-4 leading-[1.04] font-semibold tracking-[-0.035em] lg:col-span-7">
              I make the things I wish my own devices came with.
            </p>
            <div className="measure space-y-5 text-step-1 text-muted lg:col-span-5 lg:pt-3">
              <p>
                I&rsquo;m {site.maker}, and {site.name} is my independent studio. It&rsquo;s where I build small, focused
                web apps for people who care about their iPhone, iPad and Mac as much as I do.
              </p>
              <p>
                It started with a simple itch: I wanted every Apple wallpaper in one place, at the right size, without
                hunting through forums. That became Backdrop. Then I wanted a calmer way to find apps and keep track of
                every release Apple ships, and that became Orchard.
              </p>
              <p>
                The name is the idea. A canopy is one shelter with many branches. Each project is its own little world,
                and this site is the window between them.
              </p>
            </div>
          </div>

          <section aria-labelledby="how-title" className="mt-24 border-t border-line pt-12 sm:mt-32">
            <h2 id="how-title" className="text-step-3 font-bold tracking-[-0.035em]">
              How I work
            </h2>
            <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
              {PRINCIPLES.map((p) => (
                <li key={p.title}>
                  <h3 className="text-step-2 font-bold tracking-[-0.03em]">{p.title}</h3>
                  <p className="mt-3 text-muted">{p.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="made-title" className="mt-24 border-t border-line pt-12 sm:mt-32">
            <h2 id="made-title" className="text-step-3 font-bold tracking-[-0.035em]">
              Everything so far
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {projects.map((p) => (
                <li key={p.slug} data-project={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    transitionTypes={["nav-forward"]}
                    className="group grid min-h-11 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-5 gap-y-1 py-5 sm:grid-cols-[auto_12rem_minmax(0,1fr)_auto]"
                  >
                    <span
                      aria-hidden
                      className="row-span-2 size-12 rounded-[30%] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-[-8deg] sm:row-span-1"
                      style={{ background: `linear-gradient(150deg, ${p.palette.colors[1]}, ${p.palette.colors[0]})` }}
                    />
                    <span className="text-step-1 font-semibold group-hover:underline">{p.name}</span>
                    <span className="text-muted">{p.tagline}</span>
                    <StatusBadge status={p.status} className="hidden sm:inline-flex" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="hello-title" className="mt-24 border-t border-line pt-12 sm:mt-32">
            <h2 id="hello-title" className="text-step-3 font-bold tracking-[-0.035em]">
              Say hello
            </h2>
            <p className="measure mt-4 text-step-1 text-muted">
              Ideas, bugs, collaborations, job offers or a wallpaper you think is missing: my inbox is open.
            </p>
            <SocialLinks className="mt-6" />
          </section>
        </div>
      </main>
    </ViewTransition>
  );
}
