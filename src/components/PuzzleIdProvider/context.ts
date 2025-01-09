import { createContext, useContext } from "react";

export const PuzzleIdContext = createContext<{ puzzleId: string } | undefined>(
  undefined,
);

export const usePuzzleId = () => {
  const context = useContext(PuzzleIdContext);
  if (!context) {
    throw new Error("Must be rendered inside of <PuzzleIdContext.Provider />!");
  }
  return context;
};
