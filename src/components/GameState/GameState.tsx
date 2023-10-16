import { useCallback, useMemo, useReducer } from "react";
import { GameStateContext } from "./context";
import { isLetter, isLetters, neverGuard } from "../../types";
import { useWords } from "../WordsProvider";
import { useBoard } from "../BoardProvider";

type Props = {
  children: React.ReactNode;
};

type State = {
  words: string[];
  current: string;
  error: string | undefined;
};

type Update =
  | { action: "set-current"; input: string }
  | { action: "add-letter"; letter: string }
  | { action: "remove-letter" }
  | { action: "commit" };

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
            error: "Invalid input",
          };
        }

        if (!isValid(input)) {
          return {
            ...state,
            error: "Illegal move",
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
              error: "Must start with the last letter of the previous word",
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
            error: "Cannot add that letter",
          };
        }

        const input = `${state.current}${letter}`;
        if (!isValid(input)) {
          return {
            ...state,
            error: "Invalid input",
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
          };
        }

        if (state.current.length === 1) {
          if (state.words.length === 0) {
            return {
              ...state,
              current: "",
              error: undefined,
            };
          }

          const previousWord = state.words[state.words.length - 1];
          return {
            ...state,
            words: state.words.slice(0, state.words.length - 1),
            current: previousWord,
            error: undefined,
          };
        }

        return state;
      }

      case "commit": {
        const { current } = state;
        if (!current) {
          return {
            ...state,
            error: "No input provided",
          };
        }

        // TODO: validate word
        if (!dictionary.has(state.current)) {
          return {
            ...state,
            error: "Unknown word",
          };
        }

        return {
          ...state,
          // Intentionally create a new array to trigger any hook dependencies.
          words: [...state.words, state.current],
          current: state.current[state.current.length - 1],
        };
      }
      default: {
        return neverGuard(update, state);
      }
    }
  };

export const GameState = ({ children }: Props) => {
  const { dictionary } = useWords();
  const { id: boardId } = useBoard();

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

  const [{ words, current, error }, dispatch] = useReducer(
    reducer(dictionary, isValid),
    {
      words: [],
      current: "",
      error: undefined,
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

  const combined = `${words.join("")}${current}`;
  if (!isLetters(combined)) {
    throw new Error("Something happened");
  }
  const usedLetters = new Set(combined);

  return (
    <GameStateContext.Provider
      value={{
        words,
        current,
        setInput,
        add,
        remove,
        commit,
        usedLetters,
        error,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
