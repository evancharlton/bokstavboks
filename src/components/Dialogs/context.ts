import { createContext, useContext } from "react";

export type DialogType =
  | "help"
  | "about"
  | "solve"
  | "settings"
  | "hamburger"
  | { title: string; content: React.ReactNode };

export const DialogContext = createContext<
  { show: (kind: DialogType) => void; hide: () => void } | undefined
>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Must be rendered in a <Dialogs />!");
  }
  return context;
};
