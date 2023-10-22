import { useCallback, useEffect, useMemo, useReducer } from "react";
import { GameStateContext } from "./context";
import { isLetters } from "../../types";
import { useWords } from "../WordsProvider";
import { useBoard } from "../BoardProvider";
import { SavedState, State, isSavedState } from "./types";
import { reducer } from "./reducer";
import { useStorage } from "../../useStorage";
import { useSolution } from "../SolutionProvider";
import { useToaster } from "../Toaster";
import { ERRORS } from "./errors";

type Props = {
  children: React.ReactNode;
} & Partial<State>;

export const GameState = ({ children, ...initialState }: Props) => {
  const { dictionary } = useWords();
  const { id: boardId } = useBoard();
  const { solve: solveBoard } = useSolution();
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
    { restoreComplete, words, current, error, solved, revealed },
    dispatch,
  ] = useReducer(reducer(dictionary, isValid), {
    words: [],
    current: "",
    error: undefined,
    solved: false,
    revealed: false,
    restoreComplete: false,
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
        return { words: [], solved: false, revealed: false };
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
        revealed,
      });
    }
  }, [boardId, restoreComplete, revealed, solved, games, words]);

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
