import { createContext, useContext } from "react";

export type PreviousSolution = {
  words: string[];
  timestamp: number;
};

export const GameHistoryContext = createContext<
  { solutions: PreviousSolution[]; add: (words: string[]) => void } | undefined
>(undefined);

export const useGameHistory = () => {
  const context = useContext(GameHistoryContext);
  if (!context) {
    throw new Error("Must be used inside of GameHistoryContext.Provider");
  }
  return context;
};
