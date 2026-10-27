import Link from "next/link";
import { ViewTransition } from "react";
import { ExternalIcon } from "@/components/icons";
import { ProjectPreview } from "@/components/previews/registry";
import { StatusBadge } from "@/components/status-badge";
import { chapterProjects } from "@/content/projects";
import type { Project } from "@/content/schema";
import { ChapterFrame } from "./chapter-frame";
import { WorldObserver } from "./world-observer";

export function Chapters() {
  return (
    <section id="work" aria-labelledby="work-title">
      <h2 id="work-title" className="sr-only">
        Projects
      </h2>
      {chapterProjects.map((p) => (
        <ChapterFrame key={p.slug} slug={p.slug} labelledBy={`${p.slug}-title`} text={<ChapterText project={p} />} preview={
            <ViewTransition name={`preview-${p.slug}`} share="morph" default="none">
              <div>
                <ProjectPreview project={p} />
              </div>
            </ViewTransition>
          } />
      ))}
      <WorldObserver />
    </section>
  );
}

function ChapterText({ project: p }: { project: Project }) {
  return (
    <div className="max-w-[34rem]">
      <StatusBadge status={p.status} />
      <h3 id={`${p.slug}-title`} className="mt-5 text-step-5 font-bold tracking-[-0.045em]">
        {p.name}
      </h3>
      <p className="font-display mt-4 text-step-2 leading-[1.12] font-medium tracking-[-0.02em]">{p.tagline}</p>
      <ul className="mt-8 space-y-3 text-muted">
        {p.highlights.map((h) => (
          <li key={h} className="flex gap-3">
            <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-p-accent" />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        {p.url && (
          <a href={p.url} className="pill bg-p-accent text-ground hover:brightness-110">
            Visit {p.name}
            <ExternalIcon className="size-4" />
          </a>
        )}
        <Link href={`/projects/${p.slug}`} transitionTypes={["nav-forward"]} className="text-link min-h-11 py-2 font-semibold">
          More about {p.name}
        </Link>
      </div>
    </div>
  );
}
