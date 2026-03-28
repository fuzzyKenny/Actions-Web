import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type SiteFooterProps = {
  reducedMotion: boolean;
};

type FooterLink = {
  label: string;
  hoverLabel: string;
  href: string;
  icon: typeof FaGithub;
};

const FOOTER_LINKS: FooterLink[] = [
  {
    label: "Twitter",
    hoverLabel: "@fuzzyKny",
    href: "https://x.com/fuzzykny",
    icon: FaXTwitter,
  },
  {
    label: "GitHub",
    hoverLabel: "fuzzyKenny/Actions-CLI",
    href: "https://github.com/fuzzyKenny/Actions-CLI",
    icon: FaGithub,
  },
] as const;

export function SiteFooter({ reducedMotion }: SiteFooterProps) {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const twitterJiggle = reducedMotion
    ? undefined
    : {
        rotate: [0, 12, -10, 7, -5, 3, 0],
      };
  const socialTransition = reducedMotion
    ? { duration: 0 }
    : {
        type: "spring" as const,
        bounce: 0,
        duration: 0.34,
      };
  const containerVariants = reducedMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
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
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
      };

  return (
    <footer className="border-t border-border/80 pt-10 pb-4 sm:pt-14 sm:pb-6">
      <motion.div
        className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] xl:items-end"
        variants={containerVariants}
        initial={reducedMotion ? undefined : "hidden"}
        whileInView={reducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div className="grid gap-3" variants={itemVariants}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
            ACT-CLI
          </p>
          <p className="max-w-120 text-balance text-lg leading-7 text-muted-foreground">
            Open-source tooling for turning intent into clear next steps,
            faster installs, and cleaner execution.
          </p>
        </motion.div>

        <motion.div className="grid gap-5 xl:justify-self-end" variants={itemVariants}>
          <nav className="flex flex-wrap gap-2">
            {FOOTER_LINKS.map((link) => {
              const Icon = link.icon;

              return (
                <motion.a
                  key={link.label}
                  layout
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                  transition={socialTransition}
                  onHoverStart={() => setHoveredLink(link.label)}
                  onHoverEnd={() =>
                    setHoveredLink((current) =>
                      current === link.label ? null : current,
                    )
                  }
                >
                  <motion.span
                    layout="position"
                    className="inline-flex h-8 w-8 items-center justify-center"
                    animate={
                      reducedMotion
                        ? undefined
                        : {
                            scale: hoveredLink === link.label ? 0.92 : 1,
                          }
                    }
                    transition={socialTransition}
                  >
                    {link.label === "Twitter" ? (
                      <motion.span
                        className="inline-flex"
                        animate={twitterJiggle}
                        style={{ originX: "50%", originY: "-20%" }}
                        transition={
                          reducedMotion
                            ? undefined
                            : {
                                duration: 1.4,
                                ease: [0.32, 0, 0.18, 1],
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 2.2,
                              }
                        }
                      >
                        <Icon size={16} aria-hidden="true" />
                      </motion.span>
                    ) : (
                      <Icon size={16} aria-hidden="true" />
                    )}
                  </motion.span>
                  <motion.span
                    layout
                    className="relative inline-flex min-w-0 overflow-hidden"
                    transition={socialTransition}
                  >
                    <AnimatePresence initial={false} mode="popLayout">
                      {hoveredLink === link.label ? (
                        <motion.span
                          key={link.hoverLabel}
                          className="inline-flex whitespace-nowrap text-sm"
                          initial={
                            reducedMotion
                              ? undefined
                              : { opacity: 0, scale: 0.92, filter: "blur(4px)" }
                          }
                          animate={
                            reducedMotion
                              ? undefined
                              : { opacity: 1, scale: 1, filter: "blur(0px)" }
                          }
                          exit={
                            reducedMotion
                              ? undefined
                              : { opacity: 0, scale: 1.04, filter: "blur(4px)" }
                          }
                          transition={{
                            ...socialTransition,
                          }}
                        >
                          {link.hoverLabel}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </motion.span>
                </motion.a>
              );
            })}
          </nav>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <p>Built for people who need the next move, not another list.</p>
            <p className="text-foreground/70">Open source.</p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
