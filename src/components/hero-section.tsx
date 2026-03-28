import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { InstallCodeBlock } from "@/components/install-code-block";
import { TextFlip } from "@/components/text-flip/text-flip";
import heroImageDark from "../assets/act-cli(white).svg";

type HeroSectionProps = {
  reducedMotion: boolean;
};

const INSTALL_CODE_BLOCK_CLASS = "h-[21rem]";
const INSTALL_FOOTER_CLASS = "min-h-7";
const HERO_COMMANDS = [
  'add "study dbms"',
  "break 1",
  "list",
  "next",
] as const;

const INSTALL_GUIDES = {
  "linux-macos": {
    language: "bash",
    installCommands: [
      "git clone https://github.com/fuzzyKenny/Actions-CLI.git",
      "cd Actions-CLI",
      "chmod +x install.sh",
      "./install.sh",
      "act --help",
    ],
  },
  windows: {
    language: "powershell",
    installCommands: [
      "git clone https://github.com/fuzzyKenny/Actions-CLI.git",
      "cd Actions-CLI",
      "npm install",
      "npm run build",
      "npm link",
      "act --help",
    ],
  },
} as const;

type InstallPlatform = keyof typeof INSTALL_GUIDES;

function getDetectedInstallPlatform(): InstallPlatform {
  if (typeof navigator === "undefined") {
    return "linux-macos";
  }

  const browserNavigator = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform =
    browserNavigator.userAgentData?.platform ??
    navigator.platform ??
    navigator.userAgent;

  return /win/i.test(platform) ? "windows" : "linux-macos";
}

export function HeroSection({ reducedMotion }: HeroSectionProps) {
  const [installPlatform, setInstallPlatform] =
    useState<InstallPlatform>(getDetectedInstallPlatform);
  const [heroCommandIndex, setHeroCommandIndex] = useState(0);
  const [heroCommandCopied, setHeroCommandCopied] = useState(false);

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

  const tabContentMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 8, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -8, filter: "blur(4px)" },
        transition: {
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1] as const,
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

  async function handleHeroCommandCopy() {
    const command = `act ${HERO_COMMANDS[heroCommandIndex]}`;

    try {
      await navigator.clipboard.writeText(command);
      setHeroCommandCopied(true);

      window.setTimeout(() => {
        setHeroCommandCopied(false);
      }, 1500);
    } catch {
      setHeroCommandCopied(false);
    }
  }
  const textFlipVariants = reducedMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y: -8, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: 8, filter: "blur(4px)" },
      };
  function renderInstallPanel(platform: InstallPlatform, ghost = false) {
    const guide = INSTALL_GUIDES[platform];
    const wrapperClassName = "grid gap-3";

    return (
      <div
        className={wrapperClassName}
        aria-hidden={ghost || undefined}
      >
        <InstallCodeBlock
          className={INSTALL_CODE_BLOCK_CLASS}
          code={guide.installCommands.join("\n")}
          language={guide.language}
          reducedMotion={reducedMotion}
        />
      </div>
    );
  }

  return (
    <section className="block pt-[2.2rem] pb-8 max-sm:pt-[1.6rem]" id="hero">
      <motion.div
        className="grid max-w-340 gap-10 xl:grid-cols-[minmax(0,1fr)_36rem] xl:items-start"
        variants={containerVariants}
        initial={reducedMotion ? undefined : "hidden"}
        animate={reducedMotion ? undefined : "visible"}
      >
        <div>
          <motion.h1 className="m-0 text-foreground" variants={itemVariants}>
            <span className="sr-only">ACT-CLI</span>
            <img
              className="block h-auto w-full max-w-136"
              src={heroImageDark}
              alt=""
              aria-hidden="true"
            />
          </motion.h1>
          <motion.div className="flex flex-col gap-3 pt-8" variants={itemVariants}>
            <p className="text-balance text-2xl font-semibold uppercase tracking-[0.18em] text-foreground sm:text-[2rem]">
              Less Planning. More Doing.
            </p>
            <p className="max-w-150 text-balance text-lg leading-7 text-muted-foreground">
              Act gives you a sharper way to work: fewer vague lists, more
              executable steps, and a cleaner install flow right where you need
              it.
            </p>
            <div className="relative mt-2 w-full max-w-120 border border-border/80 bg-background/80 px-4 py-3 pr-14">
              <code className="flex min-h-7 items-center text-sm text-foreground sm:text-[0.95rem]">
                <span className="font-mono">act&nbsp;</span>
                <TextFlip
                  as={motion.span}
                  className="font-mono"
                  interval={2.2}
                  onIndexChange={setHeroCommandIndex}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
                  }
                  variants={textFlipVariants}
                >
                  {HERO_COMMANDS.map((command) => (
                    <span key={command}>{command}</span>
                  ))}
                </TextFlip>
              </code>
              <motion.button
                className="absolute top-1/2 right-3 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                type="button"
                whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                onClick={handleHeroCommandCopy}
              >
                <span
                  className="inline-flex h-4 w-4 items-center justify-center overflow-hidden"
                  aria-label={heroCommandCopied ? "Copied" : "Copy"}
                >
                  <AnimatePresence initial={false} mode="popLayout">
                    {heroCommandCopied ? (
                      <motion.span
                        key="hero-check"
                        className="inline-flex h-4 w-4 items-center justify-center"
                        initial={
                          reducedMotion
                            ? undefined
                            : { opacity: 0, y: 4, filter: "blur(4px)" }
                        }
                        animate={
                          reducedMotion
                            ? undefined
                            : { opacity: 1, y: 0, filter: "blur(0px)" }
                        }
                        exit={
                          reducedMotion
                            ? undefined
                            : {
                                opacity: 0,
                                y: "calc(-100% - 4px)",
                                filter: "blur(4px)",
                              }
                        }
                        transition={{
                          duration: 0.24,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Check size={14} strokeWidth={2} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="hero-copy"
                        className="inline-flex h-4 w-4 items-center justify-center"
                        initial={
                          reducedMotion
                            ? undefined
                            : { opacity: 0, y: 4, filter: "blur(4px)" }
                        }
                        animate={
                          reducedMotion
                            ? undefined
                            : { opacity: 1, y: 0, filter: "blur(0px)" }
                        }
                        exit={reducedMotion ? undefined : { opacity: 0 }}
                        transition={{
                          duration: 0.24,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <Copy size={14} strokeWidth={2} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.aside className="relative min-w-0" variants={itemVariants}>
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden border border-border/80 bg-background/80">
              <div className="border-b border-border/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <p className="shrink-0 text-sm font-medium uppercase tracking-[0.14em] text-foreground">
                    Installation
                  </p>
                  <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      className={`relative overflow-hidden border px-3 py-1.5 text-base font-medium transition-colors ${
                        installPlatform === "linux-macos"
                          ? "border-border text-foreground shadow-sm"
                          : "border-transparent text-muted-foreground hover:border-border/70 hover:text-foreground"
                      }`}
                      onClick={() => setInstallPlatform("linux-macos")}
                    >
                      {installPlatform === "linux-macos" ? (
                        <motion.span
                          className="absolute inset-0 bg-card"
                          layoutId="install-tab"
                          transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.35,
                          }}
                        />
                      ) : null}
                      <span className="relative z-10">Linux/macOS</span>
                    </button>
                    <button
                      type="button"
                      className={`relative overflow-hidden border px-3 py-1.5 text-base font-medium transition-colors ${
                        installPlatform === "windows"
                          ? "border-border text-foreground shadow-sm"
                          : "border-transparent text-muted-foreground hover:border-border/70 hover:text-foreground"
                      }`}
                      onClick={() => setInstallPlatform("windows")}
                    >
                      {installPlatform === "windows" ? (
                        <motion.span
                          className="absolute inset-0 bg-card"
                          layoutId="install-tab"
                          transition={{
                            type: "spring",
                            bounce: 0,
                            duration: 0.35,
                          }}
                        />
                      ) : null}
                      <span className="relative z-10">Windows</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-4 py-4 sm:px-5 sm:py-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={installPlatform}
                    {...tabContentMotion}
                  >
                    {renderInstallPanel(installPlatform)}
                  </motion.div>
                </AnimatePresence>
                <div className={`mt-3 flex items-center ${INSTALL_FOOTER_CLASS}`}>
                  <a
                    className="w-fit text-base font-medium text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                    href="https://github.com/fuzzyKenny/Actions-CLI/blob/main/README.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Having problems ?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </section>
  );
}
