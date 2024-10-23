import { useCallback, useEffect, useMemo, useState } from "react";
import { GameHistoryContext, PreviousSolution } from "./context";
import { useBoard } from "../BoardProvider";
import { useStorage } from "../../useStorage";

export const GameHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id } = useBoard();
  const [previous, setSolutions] = useState<Record<string, PreviousSolution>>(
    {}
  );
  const storage = useStorage("found-solutions");

  useEffect(() => {
    storage
      .getItem<Record<string, PreviousSolution>>(id)
      .then((solutionMap) => {
        if (solutionMap) {
          setSolutions(solutionMap);
        }
      });
  }, [id, storage]);

  const addSolution = useCallback(
    (solution: string[]) => {
      setSolutions((previous) => {
        const key = solution.join("-");
        if (previous[key]) {
          return previous;
        }
        const next = {
          ...previous,
          [key]: {
            words: solution,
            timestamp: Date.now(),
          },
        };

        storage.setItem(id, next);

        return next;
      });
    },
    [id, storage]
  );

  const solutions = useMemo(
    () =>
      Object.values(previous).sort(
        ({ timestamp: a }, { timestamp: b }) => b - a
      ),
    [previous]
  );

  return (
    <GameHistoryContext.Provider value={{ solutions, add: addSolution }}>
      {children}
    </GameHistoryContext.Provider>
  );
};
