import { isLetter, isLetters, neverGuard } from "../../types";
import { SavedState, State } from "./types";

type Update =
  | { action: "set-frozen"; frozen: boolean }
  | { action: "set-current"; input: string }
  | { action: "add-letter"; letter: string }
  | { action: "remove-letter" }
  | { action: "commit" }
  | { action: "reset" }
  | { action: "clear-error" }
  | ({ action: "restore-complete" } & Partial<SavedState>)
  | { action: "show" }
  | { action: "hint" }
  | ({ action: "set-hint" } & Partial<State["hints"]>)
  | { action: "add-idea"; providedWord: string };

export const reducer =
  (dictionary: Set<string>, isValid: (input: string) => boolean) =>
  (state: State, update: Update): State => {
    const { action } = update;
    switch (action) {
      case "set-current": {
        const { input } = update;
        if (!isLetters(input)) {
          return {
            ...state,
            error: "contains-invalid-letters",
          };
        }

        if (!isValid(input)) {
          return {
            ...state,
            error: "append-invalid-letter",
          };
        }

        if (state.words.length > 0) {
          const previousWord = state.words[state.words.length - 1];
          if (input.length === 0) {
            // They removed their first letter; shift the previous word into the
            // input.
            return {
              ...state,
              // We explicitly want to make a new array so that we don't get stale
              // references around (ie, hooks)
              words: state.words.slice(0, state.words.length - 1),
              current: previousWord,
              error: undefined,
            };
          }

          // Make sure that the input still starts with the right letter
          const lastLetter = previousWord[previousWord.length - 1];
          if (input[0] !== lastLetter) {
            return {
              ...state,
              error: "illegal-start-letter",
            };
          }
        }

        // Everything in order!
        return {
          ...state,
          current: input,
          error: undefined,
        };
      }

      case "add-letter": {
        const { letter } = update;
        if (!isLetter(letter)) {
          return {
            ...state,
            error: "append-illegal-letter",
          };
        }

        const input = `${state.current}${letter}`;
        if (!isValid(input)) {
          return {
            ...state,
            error: "append-invalid-letter",
          };
        }

        const combined = `${input}${state.words.join("")}`;
        if (!isLetters(combined)) {
          throw new Error("Impossible situation");
        }

        return {
          ...state,
          error: undefined,
          current: input,
        };
      }

      case "remove-letter": {
        if (state.current.length > 1) {
          return {
            ...state,
            current: state.current.substring(0, state.current.length - 1),
            error: undefined,
            solved: false,
          };
        }

        if (state.words.length === 0) {
          return {
            ...state,
            current: "",
            error: undefined,
            solved: false,
          };
        }

        const previousWord = state.words[state.words.length - 1];
        return {
          ...state,
          words: state.words.slice(0, state.words.length - 1),
          current: previousWord,
          error: undefined,
          solved: false,
        };
      }

      case "commit": {
        const { current } = state;
        if (!current) {
          return {
            ...state,
            error: "no-input",
          };
        }

        if (!dictionary.has(state.current)) {
          return {
            ...state,
            error: "unknown-word",
          };
        }

        if (state.words.includes(current)) {
          return {
            ...state,
            error: "duplicate-word",
          };
        }

        try {
          // @ts-expect-error - this is weird typing
          document.activeElement?.blur?.();
        } catch {
          // This can throw sometimes.
        }

        // Intentionally create a new array to trigger any hook dependencies.
        const nextWords = [...state.words, state.current];
        const complete = new Set(nextWords.join("")).size === 12;

        return {
          ...state,
          words: nextWords,
          solved: complete,
          current: complete ? "" : state.current[state.current.length - 1],
        };
      }

      case "reset": {
        return {
          ...state,
          words: [],
          current: "",
          solved: false,
          error: undefined,
        };
      }

      case "clear-error": {
        return {
          ...state,
          error: undefined,
        };
      }

      case "show": {
        return {
          ...state,
          current: "",
          reveal: "full",
        };
      }

      case "hint": {
        const { hints: currentHints } = state;
        if (currentHints.starts) {
          // TODO: Reveal letter-by-letter?
          return {
            ...state,
            reveal: "full",
          };
        }

        if (currentHints.colors) {
          return {
            ...state,
            hints: {
              ...currentHints,
              starts: 1,
            },
          };
        }

        if (currentHints.blocks) {
          return {
            ...state,
            hints: {
              ...currentHints,
              colors: true,
            },
          };
        }

        return {
          ...state,
          hints: {
            ...currentHints,
            blocks: true,
          },
        };
      }

      case "restore-complete": {
        const migratedReveal = (() => {
          if (update.hints) {
            return {
              hints: update.hints ?? state.hints,
              reveal: update.reveal ?? state.reveal,
            };
          }

          const rev = (update.reveal ?? state.reveal) as string;
          if (rev === "first-letters") {
            return {
              hints: {
                blocks: true,
                colors: true,
                starts: 1,
              },
              reveal: "hidden" as const,
            };
          }

          if (rev === "blocks") {
            return {
              hints: {
                blocks: true,
                colors: false,
                starts: 0,
              },
              reveal: "hidden" as const,
            };
          }

          return {
            reveal: "hidden" as const,
          };
        })();

        const words = update.words ?? state.words;
        const solved = update.solved ?? state.solved;

        const finalWord = words.length > 0 ? words[words.length - 1] : "";
        const finalLetter =
          finalWord.length > 0 ? finalWord[finalWord.length - 1] : "";

        return {
          ...state,
          error: undefined,
          words: words,
          solved: solved,
          ...migratedReveal,
          restoreComplete: true,
          current: solved ? "" : finalLetter,
          ideas: update.ideas ?? state.ideas,
        };
      }

      case "set-hint": {
        const { action: _, ...delta } = update;
        return {
          ...state,
          hints: {
            ...state.hints,
            ...delta,
          },
        };
      }

      case "set-frozen": {
        return {
          ...state,
          frozen: update.frozen,
        };
      }

      case "add-idea": {
        return {
          ...state,
          ideas: {
            ...state.ideas,
            [update.providedWord]: Date.now(),
          },
        };
      }

      default: {
        return neverGuard(update, state);
      }
    }
  };
