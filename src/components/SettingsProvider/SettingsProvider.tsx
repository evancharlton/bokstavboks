import { useCallback, useEffect, useState } from "react";
import { Settings, SettingsContext } from "./context";
import { useStorage } from "../../useStorage";

type Props = {
  children: React.ReactNode;
} & Partial<Settings>;

export const SettingsProvider = ({ children, ...initialSettings }: Props) => {
  const store = useStorage("settings");
  const [settings, setSettings] = useState<Settings>({
    enableHint: false,
    ...initialSettings,
  });

  useEffect(() => {
    store.setItem("settings", settings);
  }, [settings, store]);

  const update = useCallback((update: Partial<Settings>) => {
    setSettings((old) => ({ ...old, ...update }));
  }, []);

  useEffect(() => {
    store.getItem("settings").then((settings) => {
      if (settings) {
        update(settings);
      }
    });
  }, [store, update]);

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
};
