import { ReactNode, useEffect, useState } from "react";
import { registerSW } from "virtual:pwa-register";
import { useToaster } from "../Toaster";
import { PwaContext } from "./context";

const WINDOW_RELOAD = () => {
  window.location.reload();
};

export const PwaContainer = ({ children }: { children: ReactNode }) => {
  const { show } = useToaster();
  const [updateNeeded, setUpdateNeeded] = useState(false);
  const [performUpdate, setPerformUpdate] = useState<() => void>(
    () => WINDOW_RELOAD
  );
  const [error, setError] = useState<unknown | undefined>(undefined);

  useEffect(() => {
    const updateSW = registerSW({
      onRegisteredSW: () => {
        console.log("SW registered");
      },
      onRegisterError: (error) => {
        setError(error);
      },
      onNeedRefresh: () => {
        setUpdateNeeded(true);
      },
      onOfflineReady: () => {
        console.log("Offline ready");
      },
    });

    setPerformUpdate(() => () => {
      console.info("Reloading ...");
      updateSW(true);
    });
  }, [show]);

  return (
    <PwaContext.Provider
      value={{
        updateNeeded,
        performUpdate,
        error,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};
