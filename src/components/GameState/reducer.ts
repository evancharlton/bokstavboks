import { isLetter, isLetters, neverGuard } from "../../types";
import { SavedState, State } from "./types";

type Update =
  | { action: "set-current"; input: string }
  | { action: "add-letter"; letter: string }
  | { action: "remove-letter" }
  | { action: "commit" }
  | { action: "reset" }
  | { action: "clear-error" }
  | { action: "reveal" }
  | ({ action: "restore-complete" } & Partial<SavedState>);

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
            revealed: false,
          };
        }

        if (state.words.length === 0) {
          return {
            ...state,
            current: "",
            error: undefined,
            solved: false,
            revealed: false,
          };
        }

        const previousWord = state.words[state.words.length - 1];
        return {
          ...state,
          words: state.words.slice(0, state.words.length - 1),
          current: previousWord,
          error: undefined,
          solved: false,
          revealed: false,
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
          // @ts-expect-error
          document.activeElement?.blur?.();
        } catch (ex) {
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
          error: undefined,
        };
      }

      case "clear-error": {
        return {
          ...state,
          error: undefined,
        };
      }

      case "reveal": {
        return {
          ...state,
          current: "",
          revealed: true,
        };
      }

      case "restore-complete": {
        return {
          ...state,
          error: undefined,
          current: "",
          words: update.words ?? state.words,
          solved: update.solved ?? state.solved,
          revealed: update.revealed ?? state.revealed,
          restoreComplete: true,
        };
      }

      default: {
        return neverGuard(update, state);
      }
    }
  };
