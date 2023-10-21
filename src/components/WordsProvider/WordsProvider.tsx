import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { WordsContext } from "./context";
import { Loader } from "../Loader";
import { useStorage } from "../../useStorage";
import { isLetters } from "../../types";

type Props = {
  children?: React.ReactNode;
  words?: string[];
};

export const WordsProvider = ({ children, words: initialWords }: Props) => {
  const { lang } = useParams();
  const [words, setWords] = useState<string[]>([]);

  const wordBanks = useStorage("dicts");

  useEffect(() => {
    if (initialWords) {
      setWords(initialWords);
      return;
    }

    wordBanks
      .getItem("dictionary")
      .then((list) => {
        if (
          list &&
          Array.isArray(list) &&
          list.every((item) => isLetters(item))
        ) {
          return list;
        }

        return fetch(`${process.env.PUBLIC_URL}/${lang}/words.json`)
          .then((response) => response.json())
          .then((words) => {
            // TODO: Is there a better way to store this than one huge list
            //       serialized as a key-value pair? This seems like it's
            //       missing the point of IndexedDB ...
            return wordBanks.setItem("dictionary", words).then(() => {
              return words;
            });
          });
      })
      .then((words) => {
        setWords(words);
      });
  }, [lang, initialWords, wordBanks]);

  const value = useMemo(
    () => ({
      words,
      dictionary: new Set(words),
    }),
    [words]
  );

  if (words.length === 0) {
    return <Loader text="laster ned ..." />;
  }

  return (
    <WordsContext.Provider value={value}>{children}</WordsContext.Provider>
  );
};
