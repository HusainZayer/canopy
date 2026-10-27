import type { Metadata } from "next";
import Link from "next/link";
import { IconTile, ORCHARD_TONES, type GlyphName } from "@/components/art/icon-tile";
import { chapterProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const GRID: (GlyphName | null)[] = ["bars", "leaf", "frame", "wave", null, "dots", "spark", "play", "stack"];
const TONES: (keyof typeof ORCHARD_TONES)[] = ["night", "grove", "mist", "sky", "gold", "sage", "clay", "grove", "cream"];

export default function NotFound() {
  return (
    <main id="main" className="pt-28 pb-10 sm:pt-36">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] items-center gap-x-10 gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="text-step-5 font-bold tracking-[-0.045em]">This tile wandered off.</h1>
          <p className="measure mt-6 text-step-1 text-muted">
            There&rsquo;s nothing at this address. The page may have moved, or the link may have a typo.
          </p>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/" className="pill bg-ink text-ground">
                Go to the home page
              </Link>
            </li>
            {chapterProjects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projects/${p.slug}`} className="text-link inline-flex min-h-11 items-center font-semibold">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="relative mx-auto w-full max-w-[22rem] lg:col-span-5 lg:col-start-8">
          <div className="grid grid-cols-3 gap-4">
            {GRID.map((g, i) =>
              g ? (
                <IconTile key={i} glyph={g} tone={ORCHARD_TONES[TONES[i]!]!} />
              ) : (
                <div key={i} className="aspect-square rounded-[var(--radius-tile)] border-2 border-dashed border-line" />
              ),
            )}
          </div>
          <div className="lost-tile absolute -top-[36%] right-[2%] w-[26%] lg:-top-[12%] lg:-right-[32%] lg:w-[30%]">
            <IconTile glyph="sun" tone={ORCHARD_TONES.gold!} />
          </div>
        </div>
      </div>
    </main>
  );
}
