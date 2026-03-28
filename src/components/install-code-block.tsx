import { startTransition, useEffect, useState, type CSSProperties } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { codeToTokens, createCssVariablesTheme } from "shiki";

type InstallCodeBlockProps = {
  className?: string;
  code: string;
  language: "bash" | "powershell";
  reducedMotion: boolean;
};

type HighlightToken = {
  color?: string;
  content: string;
  fontStyle?: number;
};

const installCodeTheme = createCssVariablesTheme({
  name: "actions-web-install",
  variablePrefix: "--code-",
});

function getDisplayTokens(
  line: HighlightToken[],
  language: InstallCodeBlockProps["language"],
) {
  if (language !== "powershell") {
    return line;
  }

  const firstTokenIndex = line.findIndex((token) => token.content.trim().length > 0);

  if (firstTokenIndex === -1) {
    return line;
  }

  const firstToken = line[firstTokenIndex];

  if (firstToken.color !== "var(--code-foreground)") {
    return line;
  }

  const match = firstToken.content.match(/^(\S+)([\s\S]*)$/);

  if (!match) {
    return line;
  }

  const [, command, remainder] = match;
  const nextLine = [...line];
  const replacement: HighlightToken[] = [
    {
      ...firstToken,
      content: command,
      color: "var(--code-token-function)",
    },
  ];

  if (remainder) {
    replacement.push({
      ...firstToken,
      content: remainder,
    });
  }

  nextLine.splice(firstTokenIndex, 1, ...replacement);
  return nextLine;
}

export function InstallCodeBlock({
  className,
  code,
  language,
  reducedMotion,
}: InstallCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedLines, setHighlightedLines] = useState<HighlightToken[][]>([]);

  useEffect(() => {
    let cancelled = false;

    // Token output lets us keep Shiki highlighting while rendering our own line layout.
    void codeToTokens(code, {
      lang: language,
      theme: installCodeTheme,
    })
      .then((result) => {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setHighlightedLines(result.tokens as HighlightToken[][]);
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        startTransition(() => {
          setHighlightedLines([]);
        });
      });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden border border-border/80 bg-background/80",
        className,
      )}
      style={{
        "--code-background": "transparent",
        "--code-foreground": "var(--foreground)",
        "--code-token-function":
          "color-mix(in oklab, var(--foreground) 38%, oklch(0.62 0.14 255))",
        "--code-token-keyword":
          "color-mix(in oklab, var(--foreground) 44%, oklch(0.7 0.12 225))",
        "--code-token-string":
          "color-mix(in oklab, var(--foreground) 58%, var(--muted-foreground))",
      } as CSSProperties}
    >
      <motion.button
        className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        type="button"
        whileTap={reducedMotion ? undefined : { scale: 0.92 }}
        onClick={handleCopy}
      >
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden"
          aria-label={copied ? "Copied" : "Copy"}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {copied ? (
              <motion.span
                key="check"
                className="inline-flex h-5 w-5 items-center justify-center"
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
                <Check size={16} strokeWidth={2} />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                className="inline-flex h-5 w-5 items-center justify-center"
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
                <Copy size={16} strokeWidth={2} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>

      {highlightedLines.length > 0 ? (
        <pre className="h-full min-w-0 overflow-y-auto whitespace-pre-wrap break-all px-4 py-4 pr-14 font-mono text-[0.98rem] sm:px-5 sm:pr-16 sm:text-[1.05rem]">
          <code className="grid min-w-0 gap-3">
            {highlightedLines.map((line, index) => {
              const displayLine = getDisplayTokens(line, language);

              return (
              <span
                key={`${index}-${displayLine.map((token) => token.content).join("")}`}
                className="flex items-start gap-3 whitespace-pre-wrap break-all leading-7"
              >
                <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
                  <Terminal size={13} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  {displayLine.map((token, tokenIndex) => (
                    <span
                      key={`${index}-${tokenIndex}-${token.content}`}
                      style={{ color: token.color }}
                    >
                      {token.content}
                    </span>
                  ))}
                </span>
              </span>
            );
            })}
          </code>
        </pre>
      ) : (
        <pre className="h-full min-w-0 overflow-y-auto whitespace-pre-wrap break-all px-4 py-4 pr-14 font-mono text-[0.98rem] leading-8 text-foreground sm:px-5 sm:pr-16 sm:text-[1.05rem]">
          <code className="grid gap-3">
            {code.split("\n").map((line, index) => (
              <span key={`${index}-${line}`} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
                  <Terminal size={13} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0 whitespace-pre-wrap break-all leading-8">
                  {line}
                </span>
              </span>
            ))}
          </code>
        </pre>
      )}
    </div>
  );
}
