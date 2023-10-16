import { createContext, useContext } from "react";
import { Sides } from "./types";

export const BoardContext = createContext<
  | {
      id: string;
      shuffle: () => void;
      solve: () => string[];
      seeds: string[];
      sides: Sides;
      display: string;
    }
  | undefined
>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("Must be rendered inside of <BoardContext.Provider />!");
  }
  return context;
};
