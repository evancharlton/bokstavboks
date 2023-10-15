import { createContext, useContext } from "react";

export const WordsContext = createContext<string[] | undefined>(undefined);

export const useWords = () => {
  const context = useContext(WordsContext);
  if (!context) {
    throw new Error("Must be rendered in <WordsProvider />");
  }
  return context;
};
