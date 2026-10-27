import { Chapters } from "@/components/chapters/chapters";
import { Hero } from "@/components/hero/hero";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Chapters />
      <div id="workshop" className="h-[80vh]" />
    </main>
  );
}
