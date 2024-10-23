import { createContext, useContext } from "react";
import { State } from "./types";

export const BoardContext = createContext<
  | (Pick<State, "id" | "display" | "groups"> & {
      shuffle: () => void;
      randomize: () => void;
      url: string;
      sideLookup: Record<string, number>;
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
