import localforage from "localforage";
import { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router";
import memoryStorageDriver from "localforage-memoryStorageDriver";

localforage.defineDriver(memoryStorageDriver);

const StorageContext = createContext<{ version?: string; driver?: string }>({
  version: "v1",
});

const useStorageContext = () => useContext(StorageContext);

export const useStorage = (database: string) => {
  const { lang = "??" } = useParams();
  const { version, driver } = useStorageContext();

  return useMemo(
    () =>
      localforage.createInstance({
        name: `bokstavboks/${version}/${lang}/${database}`,
        driver: driver ?? localforage.INDEXEDDB,
      }),
    [database, driver, lang, version]
  );
};

export const StorageSandbox = ({
  version,
  children,
}: {
  version: string;
  children: React.ReactNode;
}) => {
  return (
    <StorageContext.Provider
      value={{ version, driver: memoryStorageDriver._driver }}
    >
      {children}
    </StorageContext.Provider>
  );
};
