import { useCallback, useEffect, useReducer } from "react";
import { SolutionContext } from "./context";
import { State } from "./types";
import { isLetters } from "../../types";
import { findSolutionById } from "../../logic";
import { useWords } from "../WordsProvider";
import { useBoard } from "../BoardProvider";
import { useStorage } from "../../useStorage";
import { Solving } from "./Solving";
import { neverGuard } from "../../spa-components/neverGuard";

type Update =
  | { action: "start-solving"; controller: AbortController }
  | { action: "add-solution"; solution: string[] }
  | { action: "progress-update"; queueSize: number }
  | { action: "finish"; solution: string[] }
  | { action: "impossible" }
  | { action: "abort" };

const reducer = (state: State, update: Update): State => {
  const { action } = update;
  switch (action) {
    case "start-solving":
      return {
        ...state,
        status: "solving",
        solution: [],
        controller: update.controller,
      };
    case "add-solution":
      return {
        ...state,
        solution: update.solution,
      };
    case "progress-update":
      return {
        ...state,
        queueSize: update.queueSize,
        maxQueueSize: Math.max(state.maxQueueSize, update.queueSize),
      };
    case "finish":
      return {
        ...state,
        status: "solved",
        solution: update.solution,
        controller: undefined,
      };
    case "impossible":
      return {
        ...state,
        status: "impossible",
        solution: [],
        controller: undefined,
      };
    case "abort":
      state.controller?.abort();
      return {
        ...state,
        status: "pending",
        solution: [],
        controller: undefined,
      };
    default:
      return neverGuard(action, state);
  }
};

type Props = {
  children: React.ReactNode;
} & Partial<State>;

const isSolution = (v: unknown): v is State["solution"] => {
  return (
    !!v &&
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((word) => isLetters(word))
  );
};

export const SolutionProvider = ({ children, ...initialState }: Props) => {
  const { words } = useWords();
  const { id, randomize } = useBoard();
  const store = useStorage("solutions");

  const [{ status, solution, queueSize, maxQueueSize }, dispatch] = useReducer(
    reducer,
    {
      status: "pending",
      solution: [],
      controller: undefined,
      queueSize: 0,
      maxQueueSize: 0,
      ...initialState,
    },
  );

  useEffect(() => {
    store.getItem(id).then((storedSolution) => {
      if (isSolution(storedSolution)) {
        dispatch({ action: "finish", solution: storedSolution });
      }
    });
  }, [id, store]);

  const solve = useCallback(() => {
    const controller = new AbortController();

    const onSolution = (solution: string[]) =>
      dispatch({ action: "add-solution", solution });

    const onProgress = (queueSize: number) =>
      dispatch({ action: "progress-update", queueSize });

    dispatch({ action: "start-solving", controller });
    store
      .getItem(id)
      .then((storedSolution: unknown) => {
        if (isSolution(storedSolution)) {
          return storedSolution;
        }
        return findSolutionById(
          words,
          id,
          controller.signal,
          onSolution,
          onProgress,
        );
      })
      .then((solution: string[]) => {
        if (solution.length > 0) {
          dispatch({ action: "finish", solution });
          return store.setItem(id, solution);
        }
      })
      .catch(() => dispatch({ action: "impossible" }));

    return () => {
      controller.abort();
    };
  }, [id, store, words]);

  const abort = useCallback(() => {
    dispatch({ action: "abort" });
  }, []);

  useEffect(() => {
    solve();
    return () => {
      abort();
    };
  }, [abort, id, solve]);

  if (status === "pending" || status === "solving") {
    return (
      <Solving
        progress={(maxQueueSize - queueSize) / maxQueueSize}
        onNewPuzzle={() => {
          abort();
          randomize();
        }}
      />
    );
  } else if (status === "impossible") {
    return null; // TODO
  } else if (status === "solved") {
    return (
      <SolutionContext.Provider value={{ solution }}>
        {children}
      </SolutionContext.Provider>
    );
  } else {
    return neverGuard(status, null);
  }
};
