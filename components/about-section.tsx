import Link from "next/link";
import { SocialLinks } from "@/components/social-links";
import { site } from "@/config/site";

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-20 border-t border-line py-[var(--section)]">
      <div className="wrap grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-8 lg:grid-cols-12">
        <h2 id="about-title" className="text-step-1 font-semibold tracking-[-0.01em] text-muted lg:col-span-3 lg:pt-3" style={{ fontFamily: "var(--font-sans)" }}>
          About the maker
        </h2>
        <div className="lg:col-span-8 lg:col-start-5">
          <p className="font-display max-w-[22ch] text-step-4 leading-[1.04] font-semibold tracking-[-0.035em]">
            I make the things I wish my own devices came with.
          </p>
          <div className="measure mt-8 space-y-4 text-step-1 text-muted">
            <p>
              I&rsquo;m {site.maker}. {site.name} is where I build small, focused things for the Apple devices I use every
              day: a proper home for wallpapers, and a calmer way to find apps and keep up with every release.
            </p>
            <p>
              I work slowly on purpose, sweat the details most people never notice, and ship when it feels right. If you
              want to collaborate, hire me, or just say hello, I&rsquo;d love to hear from you.
            </p>
          </div>
          <SocialLinks className="mt-8" />
          <Link href="/about" className="text-link mt-4 inline-flex min-h-11 items-center text-muted">
            More about me and how I work
          </Link>
        </div>
      </div>
    </section>
  );
}
