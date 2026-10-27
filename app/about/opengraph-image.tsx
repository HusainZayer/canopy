import { site } from "@/config/site";
import { chapterProjects } from "@/content/projects";
import { ogSize, renderOg } from "@/lib/og";

export const dynamic = "force-static";
export const alt = `About ${site.name}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ title: "About", subtitle: `${site.maker} on why ${site.name} exists.`, worlds: chapterProjects });
}
