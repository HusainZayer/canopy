import { site } from "@/config/site";
import { getProject, projects } from "@/content/projects";
import { ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = `A ${site.name} project`;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) throw new Error(`Unknown project: ${slug}`);
  return renderOg({ title: p.name, subtitle: p.tagline, worlds: [p] });
}
