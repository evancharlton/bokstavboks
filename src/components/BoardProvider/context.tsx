import { createContext, useContext } from "react";
import { State } from "./types";

export const BoardContext = createContext<
  | (Pick<State, "id" | "seeds" | "solution" | "display"> & {
      shuffle: () => void;
      solve: () => void;
      randomize: () => void;
    })
  | undefined
>(undefined);

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("Must be rendered inside of <BoardContext.Provider />!");
  }
  return context;
};