import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";
import { ExternalIcon } from "@/components/icons";
import { PreviewStage } from "@/components/previews/preview-stage";
import { ProjectPreview } from "@/components/previews/registry";
import { StatusBadge } from "@/components/status-badge";
import { site } from "@/config/site";
import { getProject, projects } from "@/content/projects";
import type { Project } from "@/content/schema";
import { JsonLd, softwareApplicationLd } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.name}: ${p.tagline}`;
  return {
    title: { absolute: `${p.name} · ${site.name}` },
    description: `${p.tagline} ${p.highlights.join(" ")}`,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title, description: p.tagline, url: `/projects/${p.slug}` },
    twitter: { title, description: p.tagline },
  };
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

const SCRUB_LABEL: Record<string, string> = {
  backdrop: "Open the fold",
  orchard: "Sort the apps",
};

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const others = projects.filter((o) => o.slug !== p.slug && o.status !== "archived");
  const paragraphs = p.description.split(/\n{2,}/);

  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <main id="main" data-page-world={p.slug} data-project={p.slug} className="pt-24 sm:pt-32">
        <JsonLd data={softwareApplicationLd(p)} />
        <div className="wrap">
          <Link href={`/#${p.slug}`} transitionTypes={["nav-back"]} className="text-link inline-flex min-h-11 items-center text-muted">
            Back to all projects
          </Link>

          <header className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <StatusBadge status={p.status} />
              <h1 className="mt-5 text-step-5 font-bold tracking-[-0.045em] sm:text-[clamp(3.5rem,2rem+6vw,8rem)]">{p.name}</h1>
              <p className="font-display mt-5 max-w-[22ch] text-step-3 leading-[1.08] font-medium tracking-[-0.025em]">{p.tagline}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-5 lg:justify-end">
              {p.url && (
                <a href={p.url} className="pill bg-p-accent text-ground hover:brightness-110">
                  Visit {p.name}
                  <ExternalIcon className="size-4" />
                </a>
              )}
            </div>
          </header>

          <ViewTransition name={`preview-${p.slug}`} share="morph" default="none">
            <div className="mt-14 rounded-[2.5rem] bg-[color-mix(in_oklab,var(--surface)_55%,transparent)] px-4 py-10 ring-1 ring-line sm:mt-20 sm:px-10 sm:py-16">
              <PreviewStage label={SCRUB_LABEL[p.preview] ?? "Explore"}>
                <ProjectPreview project={p} />
              </PreviewStage>
            </div>
          </ViewTransition>

          <div className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-14 sm:mt-24 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="sr-only">About {p.name}</h2>
              <div className="measure space-y-5 text-step-1">
                {paragraphs.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
              <h2 className="mt-14 text-step-2 font-bold tracking-[-0.03em]">Highlights</h2>
              <ul className="mt-5 space-y-3 text-muted">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-p-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <Updates project={p} />
            </div>
            <aside aria-label={`${p.name} details`} className="lg:col-span-4 lg:col-start-9">
              <dl className="divide-y divide-line border-y border-line">
                <Detail term="Status">
                  <StatusBadge status={p.status} />
                </Detail>
                <Detail term="What it is">{p.kind}</Detail>
                <Detail term="Made for">{p.platforms.join(", ")}</Detail>
                {p.launchDate && <Detail term="Launched">{formatDate(p.launchDate)}</Detail>}
                {p.url && (
                  <Detail term="Website">
                    <a href={p.url} className="text-link font-semibold text-p-accent">
                      {new URL(p.url).host}
                    </a>
                  </Detail>
                )}
              </dl>
            </aside>
          </div>

          {others.length > 0 && (
            <nav aria-labelledby="more-title" className="mt-24 border-t border-line pt-10 sm:mt-32">
              <h2 id="more-title" className="text-step-2 font-bold tracking-[-0.03em]">
                More from {site.name}
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((o) => (
                  <li key={o.slug} data-project={o.slug}>
                    <Link
                      href={`/projects/${o.slug}`}
                      transitionTypes={["nav-forward"]}
                      className="group flex min-h-11 items-center gap-4 rounded-[1.5rem] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-3 pr-5 ring-1 ring-line transition-colors hover:bg-surface"
                    >
                      <span
                        aria-hidden
                        className="size-12 shrink-0 rounded-[30%] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-[-8deg]"
                        style={{ background: `linear-gradient(150deg, ${o.palette.colors[1]}, ${o.palette.colors[0]})` }}
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="font-semibold">{o.name}</span>
                        <span className="truncate text-step--1 text-muted">{o.kind}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </main>
    </ViewTransition>
  );
}

function Detail({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <dt className="text-muted">{term}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

function Updates({ project: p }: { project: Project }) {
  if (!p.next?.length && !p.changelog?.length) return null;
  return (
    <>
      {p.next && p.next.length > 0 && (
        <>
          <h2 className="mt-14 text-step-2 font-bold tracking-[-0.03em]">What&rsquo;s next</h2>
          <ul className="mt-5 space-y-3 text-muted">
            {p.next.map((n) => (
              <li key={n} className="flex gap-3">
                <span aria-hidden className="mt-[0.4em] size-3 shrink-0 rounded-full border-[1.5px] border-dashed border-p-accent" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {p.changelog && p.changelog.length > 0 && (
        <>
          <h2 className="mt-14 text-step-2 font-bold tracking-[-0.03em]">Changelog</h2>
          <ol className="mt-5 space-y-6 border-l border-line pl-6">
            {[...p.changelog]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((c) => (
                <li key={c.date + c.title} className="relative">
                  <span aria-hidden className="absolute top-[0.5em] -left-[calc(1.5rem+4.5px)] size-2 rounded-full bg-p-accent" />
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-step--1 text-muted">
                    <time dateTime={c.date}>{formatDate(c.date)}</time>
                  </p>
                  {c.body && <p className="mt-1 text-muted">{c.body}</p>}
                </li>
              ))}
          </ol>
        </>
      )}
    </>
  );
}
