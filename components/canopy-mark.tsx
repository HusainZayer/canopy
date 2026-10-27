/** The studio mark: three overlapping crowns under one line, a canopy seen from the side. */
export function CanopyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 16.5a5 5 0 0 1 9.2-2.7" />
        <path d="M7.2 12.4a5.4 5.4 0 0 1 10.3 1" />
        <path d="M12.8 15.2a4.6 4.6 0 0 1 8.2 1.3" />
        <path d="M2.5 19.5h19" />
      </g>
      <circle cx="12" cy="19.5" r="1.6" fill="var(--accent)" />
    </svg>
  );
}
