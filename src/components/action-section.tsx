import { motion } from "motion/react";
import { ActionPrinciplesTabs } from "@/components/action-principles-tabs";

type ActionSectionProps = {
  reducedMotion: boolean;
};

const ACTION_PRINCIPLES = [
  {
    title: "Clear first moves",
    description:
      "A todo names the work. An action names what to do next, so the starting point is already decided.",
  },
  {
    title: "Less friction",
    description:
      "You stop re-planning every time you come back. The next step is explicit, concrete, and ready to execute.",
  },
  {
    title: "Real momentum",
    description:
      "Finished actions compound into visible progress instead of a list that keeps getting reorganized.",
  },
] as const;

export function ActionSection({ reducedMotion }: ActionSectionProps) {
  const containerVariants = reducedMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      };

  const itemVariants = reducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
      };

  return (
    <section className="py-12 sm:py-16" id="why-actions">
      <motion.div
        className="grid gap-6 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]"
        variants={containerVariants}
        initial={reducedMotion ? undefined : "hidden"}
        whileInView={reducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div
          className="grid content-start gap-6 py-2"
          variants={itemVariants}
        >
          <div className="grid gap-3">
            <h2 className="max-w-110 text-balance text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">
              Todos capture intent. Actions create momentum.
            </h2>
            <p className="max-w-120 text-balance text-base leading-7 text-muted-foreground sm:text-lg">
              Most lists only label the work ahead. They tell you what matters,
              but leave the first move undecided. Act turns vague tasks into
              explicit next steps, so you can start faster and keep moving.
            </p>
          </div>

          <div className="grid gap-2 pt-1">
            <div className="inline-flex w-fit flex-col gap-1">
              <p className="text-balance text-sm font-semibold uppercase tracking-[0.16em] text-foreground sm:text-base">
                The shift
              </p>
            </div>
            <div className="grid gap-1 text-lg leading-8 text-foreground sm:text-xl">
              <p className="text-balance">
                Stop collecting reminders like{" "}
                <span className="text-muted-foreground">
                  "improve onboarding"
                </span>
                .
              </p>
              <p className="text-balance">
                Start defining moves like{" "}
                <span className="text-muted-foreground">
                  "rewrite the first-run prompt and test the install path."
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div className="xl:justify-self-end xl:w-[min(100%,36rem)]" variants={itemVariants}>
          <ActionPrinciplesTabs
            principles={ACTION_PRINCIPLES}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
