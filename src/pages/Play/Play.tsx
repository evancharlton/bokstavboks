import { useParams } from "react-router-dom";
import { useWords } from "../../components/WordsProvider";
import { useMemo, useState } from "react";
import { Board, LETTERS, Letter, isLetter } from "../../types";
import { addLetter, canPlay, createBoard, findSolution } from "../../logic";
import { Grid } from "../../components/Grid";

const todayId = () => {
  const today = new Date();
  return [
    today.getFullYear(),
    `0${today.getMonth() + 1}`.substr(-2),
    `0${today.getDate()}`.substr(-2),
  ].join("-");
};

const mulberry32 = (seed: number) => {
  return (): number => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const javaHashCode = (input: string): number => {
  const length = input.length;
  if (length === 0) {
    return 0;
  }

  let hash = 0;
  for (let i = 0; i < length; i += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  return hash;
};

export const Play = () => {
  const { puzzleId = todayId() } = useParams();
  const wordBank = useWords();

  const puzzleHash = javaHashCode(puzzleId);

  const [board, words] = useMemo(() => {
    if (puzzleId.length === 12 && puzzleId.split("").every(isLetter)) {
      const board: Board = {
        sequence: puzzleId.split("").filter(isLetter),
        top: new Set(puzzleId.substring(0, 3).split("").filter(isLetter)),
        left: new Set(puzzleId.substring(9, 12).split("").filter(isLetter)),
        right: new Set(puzzleId.substring(3, 6).split("").filter(isLetter)),
        bottom: new Set(puzzleId.substring(6, 9).split("").filter(isLetter)),
      };

      return [board, []];
    }

    const random = mulberry32(puzzleHash);
    const next = (dict: string[]) => dict[Math.floor(random() * dict.length)];
    const letterCounts = new Map<string, number>();
    for (const word of wordBank) {
      letterCounts.set(word, new Set(...word).size);
    }

    const words: string[] = [];
    const letterSet = new Set<string>();
    do {
      const last =
        words.length === 0 ? next(wordBank) : words[words.length - 1];
      const scopedWords = wordBank
        .filter((w) => w[0] === last[last.length - 1])
        .filter((w) => {
          let extraLetters = 0;
          for (const char of w) {
            if (!letterSet.has(char)) {
              extraLetters += 1;
            }
          }
          return letterSet.size + extraLetters <= 12;
        });
      const chosenWord = next(scopedWords);
      words.push(chosenWord);
      for (const letter of chosenWord) {
        letterSet.add(letter);
      }
    } while (letterSet.size < 12);

    const [first, ...rest] = words.join("") as unknown as Letter[];
    let boards = [createBoard(first)];
    for (const letter of rest) {
      boards = addLetter(boards, letter);
    }

    return [boards.find((board) => canPlay(board, board.sequence)), words];
  }, [puzzleHash, puzzleId, wordBank]);

  const [input, setInput] = useState("");
  const [path, setWords] = useState<string[]>([]);

  if (!board) {
    return <p>Couldn't find a good board</p>;
  }

  return (
    <div>
      <h1>Playing #{puzzleHash}</h1>
      <pre>{JSON.stringify(path, null, 2)}</pre>
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setWords((w) => [...w, input]);
            setInput(input[input.length - 1]);
          }
        }}
        onChange={(e) => {
          setInput(() => {
            const value = e.target.value;
            const [prev, last] = (() => {
              const prev = (value[value.length - 2] ?? "") as Letter;
              const last = value[value.length - 1] as Letter;
              return [
                board.top.has(prev)
                  ? "top"
                  : board.left.has(prev)
                  ? "left"
                  : board.right.has(prev)
                  ? "right"
                  : board.bottom.has(prev)
                  ? "bottom"
                  : undefined,

                board.top.has(last)
                  ? "top"
                  : board.left.has(last)
                  ? "left"
                  : board.right.has(last)
                  ? "right"
                  : board.bottom.has(last)
                  ? "bottom"
                  : undefined,
              ];
            })();

            if (!last || last === prev) {
              return value.substring(0, value.length - 1);
            }

            return value;
          });
        }}
        pattern="^a"
        value={input}
      />
      <Grid board={board} input={input} />
      <pre>{JSON.stringify(words, null, 2)}</pre>
      <button
        onClick={() => {
          try {
            const solution = findSolution(wordBank, board);
            alert(solution.join(" + "));
          } catch (ex) {
            alert("Couldn't find a solution");
          }
        }}
      >
        Solve
      </button>
    </div>
  );
};
