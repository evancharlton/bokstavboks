import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { WordsContext } from "./context";

type Props = {
  children: React.ReactNode;
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

    fetch(`${process.env.PUBLIC_URL}/${lang}/words.json`)
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
    [words]
  );

  if (words.length === 0) {
    return <h1>loading</h1>;
  }

  return (
    <WordsContext.Provider value={value}>{children}</WordsContext.Provider>
  );
};
