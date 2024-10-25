import { createContext, useContext } from "react";
import { GameStateType } from "../GameState";

export type PreviousSolution = {
  words: string[];
  reveal: GameStateType["reveal"];
  timestamp: number;
};

export const GameHistoryContext = createContext<
  | {
      solutions: PreviousSolution[];
      add: (info: Omit<PreviousSolution, "timestamp">) => void;
    }
  | undefined
>(undefined);

export const useGameHistory = () => {
  const context = useContext(GameHistoryContext);
  if (!context) {
    throw new Error("Must be used inside of GameHistoryContext.Provider");
  }
  return context;
};
