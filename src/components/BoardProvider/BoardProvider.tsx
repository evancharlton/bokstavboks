import { useCallback, useEffect, useMemo, useState } from "react";
import { Board, Letter, boardId, isLetter } from "../../types";
import { BoardContext } from "./context";
import { createBoard, addLetter, canPlay } from "../../logic";
import { usePuzzleId } from "../PuzzleIdProvider";
import { useWords } from "../WordsProvider";

type Props = {
  children: React.ReactNode;
};

export const BoardProvider = ({ children }: Props) => {
  const { words: wordBank } = useWords();
  const { puzzleId, puzzleHash, random } = usePuzzleId();

  const [board, setBoard] = useState<Board>();
  const [words, setWords] = useState<string[]>([]);
  const shuffle = useCallback(() => {
    console.log("shuffle()");
  }, []);

  useEffect(() => {
    if (puzzleId.length === 12 && puzzleId.split("").every(isLetter)) {
      const board: Board = {
        sequence: puzzleId.split("").filter(isLetter),
        sideA: new Set(puzzleId.substring(0, 3).split("").filter(isLetter)),
        sideB: new Set(puzzleId.substring(9, 12).split("").filter(isLetter)),
        sideC: new Set(puzzleId.substring(3, 6).split("").filter(isLetter)),
        sideD: new Set(puzzleId.substring(6, 9).split("").filter(isLetter)),
      };

      setBoard(board);
      return;
    }

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

    setBoard(boards.find((board) => canPlay(board, board.sequence)));
    setWords(words);
  }, [puzzleHash, puzzleId, random, wordBank]);

  if (!board) {
    return <h1>No board</h1>; // TODO: Loading
  }

  return (
    <BoardContext.Provider
      value={{ board, id: boardId(board), shuffle, words }}
    >
      {children}
    </BoardContext.Provider>
  );
};
