import { AboutSection } from "@/components/about-section";
import { Chapters } from "@/components/chapters/chapters";
import { Hero } from "@/components/hero/hero";
import { Workshop } from "@/components/workshop";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Chapters />
      <Workshop />
      <AboutSection />
    </main>
  );
}
