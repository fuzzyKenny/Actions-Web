import { type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { ActionSection } from "@/components/action-section";
import { HeroSection } from "@/components/hero-section";
import { SiteFooter } from "@/components/site-footer";

function App() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const pageBackgroundStyle: CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, #a8a29e 1px, transparent 1px),
      linear-gradient(to bottom, #a8a29e 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 0 0",
    maskImage: `
      repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)
    `,
    WebkitMaskImage: `
      repeating-linear-gradient(
        to right,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      repeating-linear-gradient(
        to bottom,
        black 0px,
        black 3px,
        transparent 3px,
        transparent 8px
      ),
      radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)
    `,
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={pageBackgroundStyle}
        aria-hidden="true"
      />
      <main className="relative z-10 mx-auto w-[min(1200px,calc(100vw-2rem))] px-0 pt-8 pb-20 max-sm:w-[min(100vw-1rem,100%)]">
        <HeroSection reducedMotion={reducedMotion} />
        <ActionSection reducedMotion={reducedMotion} />
        <SiteFooter reducedMotion={reducedMotion} />
      </main>
    </div>
  );
}

export default App;
