import { createContext, useContext } from "react";

export type Settings = {
  enableHint: boolean;
};

export const SettingsContext = createContext<
  | { settings: Settings; update: (update: Partial<Settings>) => void }
  | undefined
>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("Must be rendered inside <SettingsContext.Provider />!");
  }
  return context;
};
