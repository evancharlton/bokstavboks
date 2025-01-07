import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { GameStateContext } from "./context";
import { isLetters } from "../../types";
import { useWords } from "../WordsProvider";
import { useBoard } from "../BoardProvider";
import { SavedState, State, isSavedState } from "./types";
import { reducer } from "./reducer";
import { useStorage } from "../../useStorage";
import { useToaster } from "../Toaster";
import { ERRORS } from "./errors";
import { useGameHistory } from "../GameHistoryProvider";

type Props = {
  children: React.ReactNode;
} & Partial<State>;

export const GameState = ({ children, ...initialState }: Props) => {
  const { words: dictionaryArray, dictionary } = useWords();
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
    [boardId],
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
    [sides],
  );

  const reducerMemo = useMemo(
    () => reducer(dictionary, isValid),
    [dictionary, isValid],
  );

  const [
    {
      frozen,
      restoreComplete,
      words,
      current,
      error,
      solved,
      reveal,
      hints,
      ideas,
    },
    dispatch,
  ] = useReducer(reducerMemo, {
    frozen: false,
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
    ideas: {},
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
        ideas,
      });
    }
  }, [boardId, restoreComplete, reveal, solved, games, words, hints, ideas]);

  const setInput = useCallback((input: string) => {
    dispatch({ action: "set-current", input });
  }, []);

  const commit = useCallback(() => {
    dispatch({ action: "commit" });
  }, []);

  const add = useCallback((input: string) => {
    for (const letter of input) {
      dispatch({ action: "add-letter", letter });
    }
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

  const playRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      dispatch({ action: "set-frozen", frozen: false });
      if (playRef.current) {
        clearTimeout(playRef.current);
      }
    };
  }, []);

  const currentRef = useRef<typeof current>(current);
  currentRef.current = current;

  const provideIdea = useCallback(async (): Promise<string> => {
    const current = currentRef.current;
    const candidates = dictionaryArray.filter((word) => {
      return (
        word.length > current.length &&
        word.startsWith(current) &&
        !words.includes(word)
      );
    });
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    dispatch({ action: "add-idea", providedWord: chosen });

    dispatch({ action: "set-frozen", frozen: true });
    return new Promise<string>((resolve) => {
      const queue = chosen.split("");
      const playNext = () => {
        if (queue.length === 0) {
          dispatch({ action: "commit" });
          resolve(chosen);
          return;
        }

        const letter = queue.shift();
        if (!letter) {
          throw new Error("No more letters in the queue");
        }

        dispatch({ action: "add-letter", letter });
        playRef.current = setTimeout(playNext, 500);
      };

      playNext();
    }).finally(() => {
      dispatch({ action: "set-frozen", frozen: false });
    });
  }, [dictionaryArray, words]);

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

  const { add: addSolution } = useGameHistory();
  useEffect(() => {
    if (solved) {
      addSolution({ words, reveal });
    }
  }, [addSolution, words, solved, reveal]);

  return (
    <GameStateContext.Provider
      value={{
        frozen,
        words,
        current,
        reveal,
        solved,
        hints,
        ideas,
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
        provideIdea,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
