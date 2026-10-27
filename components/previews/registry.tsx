import type { ComponentType } from "react";
import type { Project } from "@/content/schema";
import { BackdropPreview } from "./backdrop-preview";
import { GenericPreview } from "./generic-preview";
import { OrchardPreview } from "./orchard-preview";

/**
 * Custom previews, keyed by the `preview` field in content/projects.ts.
 * To add one: write a component that takes `{ project }`, then register it here.
 * Any key that is not registered renders the generic tile.
 */
const previews: Record<string, ComponentType<{ project: Project }>> = {
  backdrop: BackdropPreview,
  orchard: OrchardPreview,
};

export function ProjectPreview({ project }: { project: Project }) {
  const Preview = previews[project.preview] ?? GenericPreview;
  return <Preview project={project} />;
}

export function hasCustomPreview(project: Project) {
  return project.preview in previews;
}
