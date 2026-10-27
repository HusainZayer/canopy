import { site } from "@/config/site";
import type { Project } from "@/content/schema";

const PLATFORM_OS: Record<Project["platforms"][number], string> = {
  iPhone: "iOS",
  iPad: "iPadOS",
  Mac: "macOS",
  "Apple Watch": "watchOS",
  "Apple TV": "tvOS",
  "Apple Vision": "visionOS",
  Web: "Web",
};

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  founder: { "@type": "Person", name: site.maker },
  sameAs: site.social.map((s) => s.href),
};

export function softwareApplicationLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    description: p.tagline,
    url: p.url ?? `${site.url}/projects/${p.slug}`,
    applicationCategory: p.preview === "backdrop" ? "DesignApplication" : "UtilitiesApplication",
    operatingSystem: [...new Set(p.platforms.map((x) => PLATFORM_OS[x]))].join(", "),
    ...(p.launchDate ? { datePublished: p.launchDate } : {}),
    author: { "@type": "Person", name: site.maker },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

/** Renders JSON-LD safely (escapes `<` so content can never close the script tag). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
