import localforage from "localforage";
import { useMemo } from "react";
import { useParams } from "react-router";

export const useStorage = (database: string) => {
  const { lang = "??" } = useParams();
  return useMemo(
    () =>
      localforage.createInstance({ name: `bokstavboks/${lang}/${database}` }),
    [database, lang]
  );
};
