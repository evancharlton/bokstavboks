import { createContext, useContext } from "react";
import { Letter } from "../../types";

export const GameStateContext = createContext<
  | {
      words: string[];
      current: string;
      setInput: (input: string) => void;
      add: (letter: string) => void;
      remove: () => void;
      commit: () => void;
      usedLetters: Set<Letter>;
      error?: string;
    }
  | undefined
>(undefined);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("Must be rendered inside <GameState />!");
  }
  return context;
};
