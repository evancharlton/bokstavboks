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

  const update = useCallback(
    (update: Partial<Settings>) => {
      setSettings((old) => {
        const merged = { ...old, ...update };

        store.setItem("settings", merged);

        return merged;
      });
    },
    [store],
  );

  useEffect(() => {
    store.getItem("settings").then((loaded) => {
      if (loaded) {
        setSettings((old) => ({ ...old, ...loaded }));
      }
    });
  }, [store]);

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
};
