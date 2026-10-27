import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { site } from "@/config/site";
import { workshopProjects } from "@/content/projects";
import type { Project } from "@/content/schema";

export function Workshop() {
  if (workshopProjects.length === 0) return null;
  return (
    <section id="workshop" aria-labelledby="workshop-title" className="scroll-mt-20 py-[var(--section)]">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="workshop-title" className="text-step-4 font-bold tracking-[-0.04em]">
            In the workshop
          </h2>
          <p className="mt-5 max-w-[30ch] text-step-1 text-muted">
            Things on the bench that aren&rsquo;t ready to show yet. A codename and a hint, for now.
          </p>
        </div>
        <ul className="grid content-start gap-4 self-start lg:col-span-7 lg:col-start-6">
          {workshopProjects.map((p) => (
            <WorkshopCard key={p.slug} project={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function WorkshopCard({ project: p }: { project: Project }) {
  const notify = p.notifyUrl ?? site.newsletterUrl;
  const [c1, c2, c3, c4] = p.palette.colors;
  return (
    <li
      data-project={p.slug}
      className="group relative grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-5 overflow-hidden rounded-[1.75rem] bg-[color-mix(in_oklab,var(--surface)_72%,transparent)] p-4 ring-1 ring-line sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-7 sm:p-5"
    >
      {/* A silhouette: the project's colours, blurred past recognition */}
      <div aria-hidden className="relative aspect-square overflow-hidden rounded-[24%]" style={{ background: c1 }}>
        <div
          className="workshop-drift absolute inset-[-20%] blur-[18px]"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${c4}, transparent 45%), radial-gradient(circle at 70% 65%, ${c3}, transparent 50%), radial-gradient(circle at 40% 80%, ${c2}, transparent 55%)`,
          }}
        />
        <div className="absolute inset-[26%] rounded-[30%] bg-white/25 blur-[6px]" />
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-white/20 ring-inset" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="text-step-2 font-bold tracking-[-0.03em]">
            <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:rounded-[inherit] after:content-['']">
              {p.name}
            </Link>
          </h3>
          <StatusBadge status={p.status} />
        </div>
        <p className="mt-2 text-muted">{p.tagline}</p>
        {notify && (
          <a
            href={notify}
            className="text-link relative z-10 mt-3 inline-flex min-h-11 items-center font-semibold text-p-accent"
          >
            Notify me when {p.name} is ready
          </a>
        )}
      </div>
    </li>
  );
}
