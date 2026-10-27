import { liveEmail, liveSocial } from "@/config/site";

/** Plain text links to the maker's profiles and email. Placeholder links are left out. */
export function SocialLinks({ className }: { className?: string }) {
  if (liveSocial.length === 0 && !liveEmail) return null;
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className ?? ""}`}>
      {liveSocial.map((s) => (
        <li key={s.label}>
          <a href={s.href} className="text-link inline-flex min-h-11 items-center font-semibold" rel="me">
            {s.label}
          </a>
        </li>
      ))}
      {liveEmail && (
        <li>
          <a href={`mailto:${liveEmail}`} className="text-link inline-flex min-h-11 items-center font-semibold">
            {liveEmail}
          </a>
        </li>
      )}
    </ul>
  );
}
