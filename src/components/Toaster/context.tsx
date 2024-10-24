import { createContext, useContext } from "react";

export type ToastType = {
  text: React.ReactNode;
  level: "info" | "warning";
  duration?: number;
};

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
