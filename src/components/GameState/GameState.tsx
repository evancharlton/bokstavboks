import { useCallback, useEffect, useMemo, useReducer } from "react";
import { GameStateContext } from "./context";
import { isLetters } from "../../types";
import { useWords } from "../WordsProvider";
import { useBoard } from "../BoardProvider";
import { SavedState, State, isSavedState } from "./types";
import { reducer } from "./reducer";
import { useStorage } from "../../useStorage";
import { useToaster } from "../Toaster";
import { ERRORS } from "./errors";

type Props = {
  children: React.ReactNode;
} & Partial<State>;

export const GameState = ({ children, ...initialState }: Props) => {
  const { dictionary } = useWords();
  const { id: boardId } = useBoard();
  const { show: showToast, hide: hideToast } = useToaster();

  const games = useStorage("games");

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

  const [
    { restoreComplete, words, current, error, solved, reveal, hints },
    dispatch,
  ] = useReducer(reducer(dictionary, isValid), {
    words: [],
    current: "",
    error: undefined,
    solved: false,
    reveal: "hidden",
    restoreComplete: false,
    hints: {
      blocks: false,
      colors: false,
      starts: 0,
    },
    ...initialState,
  } satisfies State);

  useEffect(() => {
    games
      .getItem(boardId)
      .then((value): SavedState | undefined => {
        if (!value) {
          return undefined;
        }
        if (!isSavedState(value)) {
          throw new Error("Invalid content");
        }
        return value;
      })
      .catch((e) => {
        console.warn("Failed to restore", e);
        games.removeItem(boardId);
        return {
          reveal: "hidden",
        } satisfies Partial<SavedState>;
      })
      .then((update) => {
        dispatch({
          action: "restore-complete",
          ...update,
        });
      });
  }, [boardId, games]);

  useEffect(() => {
    if (restoreComplete) {
      games.setItem(boardId, {
        words,
        solved,
        reveal,
        hints,
      });
    }
  }, [boardId, restoreComplete, reveal, solved, games, words, hints]);

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

  const show = useCallback(() => {
    dispatch({ action: "show" });
  }, []);

  const hint = useCallback(() => {
    dispatch({ action: "hint" });
  }, []);

  const setHints = useCallback((delta: Partial<State["hints"]>) => {
    dispatch({ action: "set-hint", ...delta });
  }, []);

  const combined = `${words.join("")}`;
  if (!isLetters(combined)) {
    throw new Error("Impossible input");
  }
  const usedLetters = new Set(combined);

  useEffect(() => {
    if (error) {
      const errorText = ERRORS[error];
      if (errorText) {
        showToast({ text: errorText, level: "warning" });
      }
    }
    clearError();
  }, [clearError, error, hideToast, showToast]);

  return (
    <GameStateContext.Provider
      value={{
        words,
        current,
        reveal,
        solved,
        hints,
        setInput,
        add,
        remove,
        commit,
        reset,
        usedLetters,
        error,
        clearError,
        show,
        hint,
        setHints,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
