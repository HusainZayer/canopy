import { site } from "@/config/site";

/** Plain text links to the maker's profiles and email. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className ?? ""}`}>
      {site.social.map((s) => (
        <li key={s.label}>
          <a href={s.href} className="text-link inline-flex min-h-11 items-center font-semibold" rel="me">
            {s.label}
          </a>
        </li>
      ))}
      <li>
        <a href={`mailto:${site.email}`} className="text-link inline-flex min-h-11 items-center font-semibold">
          {site.email}
        </a>
      </li>
    </ul>
  );
}
