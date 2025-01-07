import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router";
import { WordsContext } from "./context";
import { Loader } from "../../spa-components/Loader";

type Props = {
  children?: React.ReactNode;
  words?: string[];
};

export const WordsProvider = ({ children, words: initialWords }: Props) => {
  const { lang } = useParams();
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    if (initialWords) {
      setWords(initialWords);
      return;
    }

    const url = `${import.meta.env.BASE_URL}/${lang}/words.json`.replace(
      /^\/\//g,
      "/",
    );
    fetch(url)
      .then((response) => response.json())
      .then((words) => {
        setWords(words);
      });
  }, [lang, initialWords]);

  const value = useMemo(
    () => ({
      words,
      dictionary: new Set(words),
    }),
    [words],
  );

  if (words.length === 0) {
    return <Loader text="laster ned ..." />;
  }

  return (
    <WordsContext.Provider key={lang} value={value}>
      {children}
      <Outlet />
    </WordsContext.Provider>
  );
};
