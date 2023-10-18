import { useReducer } from "react";
import { Letter, isLetter } from "../../../types";

type State = {
  words: string[];
  current: string;
  letters: Set<Letter>;
  onChange: Props["onChange"];
};

type Update =
  | { action: "add-word" }
  | { action: "remove-word"; word: string }
  | { action: "add-letter"; value: string };

const reducer = (state: State, update: Update): State => {
  const { action } = update;
  switch (action) {
    case "add-word": {
      const word = state.current;
      if (word.length <= 1) {
        // TODO: error
        return state;
      }

      const letters = word.split("");
      if (!letters.every(isLetter)) {
        // TODO: error
        return state;
      }

      const words = [...state.words, word];
      state.onChange(words.join("").split("").filter(isLetter));

      return {
        ...state,
        words,
        letters: new Set<Letter>(words.join("").split("").filter(isLetter)),
        current: word[word.length - 1],
      };
    }

    case "remove-word": {
      const nextWords = state.words.filter((w) => w !== update.word);
      const lastWord =
        nextWords.length > 0 ? nextWords[nextWords.length - 1] : undefined;

      state.onChange(nextWords.join("").split("").filter(isLetter));

      const letters = new Set<Letter>(
        nextWords.join("").split("").filter(isLetter)
      );

      return {
        ...state,
        letters,
        words: nextWords,
        current: lastWord === undefined ? "" : lastWord[lastWord.length - 1],
      };
    }

    case "add-letter": {
      const { value } = update;
      if (state.words.length > 0) {
        const lastWord = state.words[state.words.length - 1];
        if (value[0] !== lastWord[lastWord.length - 1]) {
          // TODO: error
          return state;
        }
      }

      if (!value.split("").every(isLetter)) {
        // TODO: error
        return state;
      }

      return {
        ...state,
        current: value,
      };
    }
    default: {
      throw new Error("Oops");
    }
  }
};

type Props = {
  onChange: (seq: Letter[]) => void;
};

export const Words = ({ onChange }: Props) => {
  const [{ words, letters, current }, dispatch] = useReducer(reducer, {
    words: [],
    current: "",
    onChange,
    letters: new Set<Letter>(),
  });

  return (
    <div>
      {words.map((word) => {
        return (
          <h2 key={word}>
            {word}
            <button onClick={() => dispatch({ action: "remove-word", word })}>
              x
            </button>
          </h2>
        );
      })}
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            dispatch({ action: "add-word" });
          }
        }}
        onChange={(e) => {
          dispatch({ action: "add-letter", value: e.target.value });
        }}
        disabled={letters.size === 12}
        value={current}
      />
    </div>
  );
};
