import { createContext, useContext } from "react";
import { State } from "./types";

export const SolutionContext = createContext<
  | ({ solve: () => void; abort: () => void } & Pick<
      State,
      "status" | "solution" | "queueSize"
    >)
  | undefined
>(undefined);

export const useSolution = () => {
  const context = useContext(SolutionContext);
  if (!context) {
    throw new Error("Must be rendered in a <SolutionContext.Provider />!");
  }
  return context;
};
