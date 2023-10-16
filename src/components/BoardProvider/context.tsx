import { createContext, useContext } from "react";
import { Board } from "../../types";

export const BoardContext = createContext<
  { board: Board; shuffle: () => void; words: string[] } | undefined
>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("Must be rendered inside of <BoardContext.Provider />!");
  }
  return context;
};
