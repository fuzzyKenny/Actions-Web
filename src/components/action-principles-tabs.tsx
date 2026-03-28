import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useEffectEvent,
  useState,
  type FocusEvent,
} from "react";

type Principle = {
  title: string;
  description: string;
};

type ActionPrinciplesTabsProps = {
  principles: readonly Principle[];
  reducedMotion: boolean;
};

const AUTO_SWITCH_MS = 3600;

export function ActionPrinciplesTabs({
  principles,
  reducedMotion,
}: ActionPrinciplesTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advanceTab = useEffectEvent(() => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % principles.length);
  });

  useEffect(() => {
    if (reducedMotion || paused || principles.length < 2) {
      return;
    }

    const intervalId = window.setInterval(() => {
      advanceTab();
    }, AUTO_SWITCH_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [paused, principles.length, reducedMotion]);

  function handlePause() {
    setPaused(true);
  }

  function handleResume() {
    setPaused(false);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (
      event.relatedTarget instanceof Node &&
      event.currentTarget.contains(event.relatedTarget)
    ) {
      return;
    }

    setPaused(false);
  }

  function handleTabClick(index: number) {
    setActiveIndex(index);
  }

  function handleTabHover(index: number) {
    setActiveIndex(index);
  }

  const activePrinciple = principles[activeIndex];
  const contentMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10, filter: "blur(5px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -10, filter: "blur(5px)" },
        transition: {
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      };

  return (
    <div
      className="grid overflow-hidden border border-border/80 bg-background/80"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocusCapture={handlePause}
      onBlurCapture={handleBlur}
    >
      <div className="flex gap-px border-b border-border/80 bg-border/80">
        {principles.map((principle, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={principle.title}
              type="button"
              className="relative min-w-0 flex-1 overflow-hidden bg-background px-4 py-4 text-left sm:px-5"
              onClick={() => handleTabClick(index)}
              onMouseEnter={() => handleTabHover(index)}
            >
              {isActive ? (
                <motion.span
                  className="absolute inset-0 bg-card"
                  layoutId="action-principle-tab"
                  transition={{
                    type: "spring",
                    bounce: 0,
                    duration: 0.35,
                  }}
                />
              ) : null}

              <span className="relative z-10 text-sm font-medium uppercase tracking-[0.14em] text-foreground">
                {principle.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-h-56 content-between gap-6 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-foreground">
            Action principles
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(principles.length).padStart(2, "0")}
          </p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activePrinciple.title}
            className="grid gap-2"
            {...contentMotion}
          >
            <h3 className="max-w-110 text-balance text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-[2rem]">
              {activePrinciple.title}
            </h3>
            <p className="max-w-120 text-balance text-base leading-7 text-muted-foreground sm:text-lg">
              {activePrinciple.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="grid gap-3">
          <div className="flex gap-2">
            {principles.map((principle, index) => (
              <span
                key={principle.title}
                className="h-1 flex-1 overflow-hidden bg-border/80"
              >
                {index === activeIndex ? (
                  <motion.span
                    className="block h-full bg-foreground"
                    initial={
                      reducedMotion
                        ? undefined
                        : { scaleX: 0, transformOrigin: "left center" }
                    }
                    animate={
                      reducedMotion
                        ? undefined
                        : { scaleX: 1, transformOrigin: "left center" }
                    }
                    transition={{
                      duration: paused || reducedMotion ? 0 : AUTO_SWITCH_MS / 1000,
                      ease: "linear",
                    }}
                  />
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
