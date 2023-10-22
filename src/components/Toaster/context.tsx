import { createContext, useContext } from "react";

export type ToastType = { text: string; level: "info" | "warning" };

export const ToasterContext = createContext<
  { show: (toast: ToastType) => void; hide: () => void } | undefined
>(undefined);

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error(
      "Must be rendered inside of a <ToasterContext.Provider />!"
    );
  }
  return context;
};
