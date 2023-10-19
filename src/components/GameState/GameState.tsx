import { useCallback, useMemo, useReducer } from "react";
import { GameStateContext } from "./context";
import { isLetter, isLetters, neverGuard } from "../../types";
import { useWords } from "../WordsProvider";
import { useBoard } from "../BoardProvider";
import { State } from "./types";

type Update =
  | { action: "set-current"; input: string }
  | { action: "add-letter"; letter: string }
  | { action: "remove-letter" }
  | { action: "commit" }
  | { action: "reset" }
  | { action: "clear-error" }
  | { action: "reveal" };

const reducer =
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

      default: {
        return neverGuard(update, state);
      }
    }
  };

type Props = {
  children: React.ReactNode;
} & Partial<State>;

export const GameState = ({ children, ...initialState }: Props) => {
  const { dictionary } = useWords();
  const { id: boardId, solve: solveBoard } = useBoard();

  const sides = useMemo(
    () => ({
      [boardId[0]]: "a",
      [boardId[1]]: "a",
      [boardId[2]]: "a",
      [boardId[3]]: "b",
      [boardId[4]]: "b",
      [boardId[5]]: "b",
      [boardId[6]]: "c",
      [boardId[7]]: "c",
      [boardId[8]]: "c",
      [boardId[9]]: "d",
      [boardId[10]]: "d",
      [boardId[11]]: "d",
    }),
    [boardId]
  );

  const isValid = useCallback(
    (input: string) => {
      if (input.length === 0) {
        // Whatever.
        return true;
      }

      if (input.length === 1) {
        return !!sides[input[0]];
      }

      // Make sure no one is trying to go to a neighbor
      for (let i = 1; i < input.length; i += 1) {
        const a = input[i - 1];
        const b = input[i];

        const sideA = sides[a];
        const sideB = sides[b];
        if (!sideA || !sideB) {
          return false;
        }

        if (sideA === sideB) {
          return false;
        }
      }

      return true;
    },
    [sides]
  );

  const [{ words, current, error, solved, revealed }, dispatch] = useReducer(
    reducer(dictionary, isValid),
    {
      words: [],
      current: "",
      error: undefined,
      solved: false,
      revealed: false,
      ...initialState,
    } satisfies State
  );

  const setInput = useCallback((input: string) => {
    dispatch({ action: "set-current", input });
  }, []);

  const commit = useCallback(() => {
    dispatch({ action: "commit" });
  }, []);

  const add = useCallback((letter: string) => {
    dispatch({ action: "add-letter", letter });
  }, []);

  const remove = useCallback(() => {
    dispatch({ action: "remove-letter" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ action: "reset" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ action: "clear-error" });
  }, []);

  const solve = useCallback(() => {
    solveBoard();
    dispatch({ action: "reveal" });
  }, [solveBoard]);

  const combined = `${words.join("")}`;
  if (!isLetters(combined)) {
    throw new Error("Impossible input");
  }
  const usedLetters = new Set(combined);

  return (
    <GameStateContext.Provider
      value={{
        words,
        current,
        revealed,
        solved,
        setInput,
        add,
        remove,
        commit,
        reset,
        usedLetters,
        error,
        clearError,
        solve,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
