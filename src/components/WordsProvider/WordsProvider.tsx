import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { WordsContext } from "./context";

export const WordsProvider = ({ children }: { children?: React.ReactNode }) => {
  const { lang } = useParams();
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/${lang}/words.json`)
      .then((response) => response.json())
      .then((words) => {
        setWords(words);
      });
  }, [lang]);

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
    <WordsContext.Provider value={value}>
      <div>
        <h1>loaded {words.length} words</h1>
        {children}
      </div>
    </WordsContext.Provider>
  );
};
