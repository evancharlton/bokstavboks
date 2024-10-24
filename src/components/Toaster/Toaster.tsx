import { ContextType, useCallback, useRef, useState } from "react";
import { ToastType, ToasterContext } from "./context";
import { Toast } from "./Toast";

type Props = {
  children: React.ReactNode;
};

export const Toaster = ({ children }: Props) => {
  const [toast, setToast] = useState<ToastType>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const show: NonNullable<ContextType<typeof ToasterContext>>["show"] =
    useCallback((toast) => {
      setToast(toast);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setToast(undefined);
      }, toast.duration ?? 1500);
    }, []);

  const hide = useCallback(() => setToast(undefined), []);

  return (
    <ToasterContext.Provider value={{ show, hide }}>
      {children}
      {toast && <Toast text={toast.text} level={toast.level} />}
    </ToasterContext.Provider>
  );
};
