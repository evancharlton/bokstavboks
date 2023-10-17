import { createContext, useContext } from "react";
import { Letter } from "../../types";

export type ValidationError =
  /** The input contains letters outside the Norwegian alphabet. */
  | "contains-invalid-letters"
  /** The letter being added is not in the Norwegian alphabet. */
  | "append-illegal-letter"
  /** The letter being added is not in the puzzle. */
  | "append-invalid-letter"
  /** The current input doesn't start with the previous word's end. */
  | "illegal-start-letter"
  /** No input was provided. */
  | "no-input"
  /** Unknown word. */
  | "unknown-word";

export const GameStateContext = createContext<
  | {
      words: string[];
      current: string;
      setInput: (input: string) => void;
      add: (letter: string) => void;
      remove: () => void;
      commit: () => void;
      usedLetters: Set<Letter>;
      error?: ValidationError;
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
