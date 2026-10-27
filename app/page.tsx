import { ViewTransition } from "react";
import { AboutSection } from "@/components/about-section";
import { Chapters } from "@/components/chapters/chapters";
import { Hero } from "@/components/hero/hero";
import { Workshop } from "@/components/workshop";
import { JsonLd, organizationLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <main id="main">
        <JsonLd data={organizationLd} />
        <Hero />
        <Chapters />
        <Workshop />
        <AboutSection />
      </main>
    </ViewTransition>
  );
}
