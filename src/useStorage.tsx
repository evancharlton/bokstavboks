import localforage from "localforage";
import { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router";

const StorageContext = createContext("v1");

const useStorageContext = () => useContext(StorageContext);

export const useStorage = (database: string) => {
  const { lang = "??" } = useParams();
  const sandbox = useStorageContext();
  return useMemo(
    () =>
      localforage.createInstance({
        name: `bokstavboks/${sandbox}/${lang}/${database}`,
      }),
    [database, lang, sandbox]
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
    <StorageContext.Provider value={version}>
      {" "}
      {children}
    </StorageContext.Provider>
  );
};
