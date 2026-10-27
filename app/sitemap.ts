import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { projects } from "@/content/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/about`, changeFrequency: "yearly", priority: 0.6 },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: p.status === "live" || p.status === "beta" ? 0.8 : 0.5,
    })),
  ];
}
