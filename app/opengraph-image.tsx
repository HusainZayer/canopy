import { site } from "@/config/site";
import { chapterProjects } from "@/content/projects";
import { ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = `${site.name}: ${site.statement}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ title: site.name, subtitle: site.statement, worlds: chapterProjects });
}
