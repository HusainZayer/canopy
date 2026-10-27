import { statusLabel, type ProjectStatus } from "@/content/schema";

/** Status as text with a dot; colour comes from the surrounding project scope. */
export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const tone = status === "live" || status === "beta" ? "text-p-accent" : "text-muted";
  return <span className={`badge ${tone} ${className ?? ""}`}>{statusLabel[status]}</span>;
}
