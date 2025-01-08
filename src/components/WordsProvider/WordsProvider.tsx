import { useMemo } from "react";
import { useParams } from "react-router";
import { WordsContext } from "./context";
import { Loader } from "../../spa-components/Loader";
import { useLanguageData } from "../../spa-components/DataProvider";

type Props = {
  children?: React.ReactNode;
  words: string[];
};

export const DataFetcher = ({ children }: { children: React.ReactNode }) => {
  const { data: words, state } = useLanguageData<string[]>("words.json");

  if (state === "loaded" && words) {
    return <WordsProvider words={words}>{children}</WordsProvider>;
  }
  return <Loader text="laster ned ..." />;
};

export const WordsProvider = ({ children, words }: Props) => {
  const { lang } = useParams();

  const value = useMemo(
    () => ({
      words,
      dictionary: new Set(words),
    }),
    [words],
  );

  return (
    <WordsContext.Provider key={lang} value={value}>
      {children}
    </WordsContext.Provider>
  );
};
