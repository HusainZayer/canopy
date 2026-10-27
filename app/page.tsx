import { site } from "@/config/site";
import { projects } from "@/content/projects";

export default function Home() {
  return (
    <main id="main" className="wrap pt-32">
      <h1 className="text-display">{site.name}</h1>
      <p className="font-display text-step-4">{site.statement}</p>
      <ul className="mt-12 flex gap-4">
        {projects.map((p) => (
          <li key={p.slug} data-project={p.slug} className="rounded-3xl bg-p-tint p-6 text-p-accent">
            {p.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
