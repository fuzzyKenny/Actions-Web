import { type CSSProperties, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ActionSection } from "@/components/action-section";
import { InstallCodeBlock } from "@/components/install-code-block";
import { SiteFooter } from "@/components/site-footer";
import heroImageDark from "./assets/act-cli(white).svg";
import heroImageLight from "./assets/act-cli.svg";

// Keep the install content declarative so each platform tab can render from data.
const INSTALL_GUIDES = {
  "linux-macos": {
    description: "Clone the repo, run the installer, then verify:",
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
    description: "Windows uses a manual source setup for now.",
    setup: [
      "Install Node.js 18+ and Git, then open PowerShell or Windows Terminal.",
    ],
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

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [installPlatform, setInstallPlatform] =
    useState<InstallPlatform>("linux-macos");
  const reducedMotion = Boolean(prefersReducedMotion);
  const containerVariants = prefersReducedMotion
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
  const itemVariants = prefersReducedMotion
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
        <section
          className="block pt-[2.2rem] pb-8 max-sm:pt-[1.6rem]"
          id="hero"
        >
          <motion.div
            className="grid max-w-340 gap-10 xl:grid-cols-[minmax(0,1fr)_36rem] xl:items-start"
            variants={containerVariants}
            initial={prefersReducedMotion ? undefined : "hidden"}
            animate={prefersReducedMotion ? undefined : "visible"}
          >
            <div>
              <motion.h1
                className="m-0 text-foreground"
                variants={itemVariants}
              >
                <span className="sr-only">ACT-CLI</span>
                <img
                  className="hidden h-auto w-full max-w-136 dark:block"
                  src={heroImageDark}
                  alt=""
                  aria-hidden="true"
                />
                <img
                  className="block h-auto w-full max-w-136 dark:hidden"
                  src={heroImageLight}
                  alt=""
                  aria-hidden="true"
                />
              </motion.h1>
              <motion.div
                className="flex flex-col gap-3 pt-8"
                variants={itemVariants}
              >
                <p className="text-balance text-2xl font-semibold uppercase tracking-[0.18em] text-foreground sm:text-[2rem]">
                  Less Planning. More Doing.
                </p>
                <p className="max-w-150 text-balance text-lg leading-7 text-muted-foreground">
                  Act gives you a sharper way to work: fewer vague lists, more
                  executable steps, and a cleaner install flow right where you
                  need it.
                </p>
              </motion.div>
            </div>

            <motion.aside className="relative min-w-0" variants={itemVariants}>
              <div className="flex flex-col gap-4">
                <div className="overflow-hidden border border-border/80 bg-background/80">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
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

                  <div className="grid gap-4 px-4 py-4 sm:px-5 sm:py-5">
                    <AnimatePresence mode="wait" initial={false}>
                      {installPlatform === "linux-macos" ? (
                        <motion.div
                          key="linux-macos"
                          className="grid gap-2"
                          {...tabContentMotion}
                        >
                          <p className="text-balance text-sm leading-6 text-muted-foreground">
                            {INSTALL_GUIDES["linux-macos"].description}
                          </p>
                          <InstallCodeBlock
                            code={INSTALL_GUIDES["linux-macos"].installCommands.join("\n")}
                            language={INSTALL_GUIDES["linux-macos"].language}
                            reducedMotion={reducedMotion}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="windows"
                          className="grid gap-3"
                          {...tabContentMotion}
                        >
                          <p className="text-balance border border-amber-500/20 bg-amber-500/8 px-3 py-2 text-sm leading-6 text-amber-700 dark:text-amber-300">
                            {INSTALL_GUIDES.windows.description}
                          </p>
                          <div className="grid gap-1">
                            {INSTALL_GUIDES.windows.setup.map((step) => (
                              <p
                                key={step}
                                className="text-balance text-sm leading-6 text-muted-foreground"
                              >
                                {step}
                              </p>
                            ))}
                          </div>
                          <InstallCodeBlock
                            code={INSTALL_GUIDES.windows.installCommands.join("\n")}
                            language={INSTALL_GUIDES.windows.language}
                            reducedMotion={reducedMotion}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        </section>

        <ActionSection reducedMotion={reducedMotion} />
        <SiteFooter reducedMotion={reducedMotion} />
      </main>
    </div>
  );
}

export default App;
