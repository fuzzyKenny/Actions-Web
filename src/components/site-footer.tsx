import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type SiteFooterProps = {
  reducedMotion: boolean;
};

type FooterLink = {
  label: string;
  hoverLabel?: string;
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
                  className="inline-flex items-center gap-2 border border-border/80 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  onHoverStart={() => setHoveredLink(link.label)}
                  onHoverEnd={() => setHoveredLink((current) => (current === link.label ? null : current))}
                >
                  <Icon size={14} aria-hidden="true" />
                  {link.hoverLabel ? (
                    <span className="relative inline-flex min-w-[5.75rem] overflow-hidden">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                          key={hoveredLink === link.label ? link.hoverLabel : link.label}
                          className="inline-flex"
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
                            duration: 0.22,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {hoveredLink === link.label ? link.hoverLabel : link.label}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  ) : (
                    <span>{link.label}</span>
                  )}
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
