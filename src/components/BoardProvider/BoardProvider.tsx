import { useCallback, useEffect, useReducer, useRef } from "react";
import { Letter, boardId, isLetter, isLetters, neverGuard } from "../../types";
import { BoardContext } from "./context";
import { createBoard, addLetter, findSolution } from "../../logic";
import { usePuzzleId } from "../PuzzleIdProvider";
import { useWords } from "../WordsProvider";
import { Loader } from "../Loader";

type Props = {
  children: React.ReactNode;
  boardId?: string;
  seeds?: string[];
};

type State = {
  boardId: string;
  seeds: string[]; // Words used to generate the board
  display: string;
};

type Action =
  | { action: "set-board"; boardId: string; seeds?: string[] }
  | { action: "shuffle" };

const shuffle = <T extends unknown>(arr: T[]): T[] =>
  arr
    .map((v) => ({ v, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ v }) => v);

const shuffleId = (boardId: string): string =>
  shuffle(
    [
      [boardId[0], boardId[1], boardId[2]],
      [boardId[3], boardId[4], boardId[5]],
      [boardId[6], boardId[7], boardId[8]],
      [boardId[9], boardId[10], boardId[11]],
    ].map((arr) => shuffle(arr).join(""))
  ).join("");

const reducer = (state: State, update: Action): State => {
  const { action } = update;
  switch (action) {
    case "set-board": {
      const { seeds, boardId } = update;
      if (boardId.length !== 12) {
        throw new Error("Invalid board ID provided");
      }

      if (!isLetters(boardId)) {
        throw new Error("Invalid board ID");
      }

      return {
        ...state,
        seeds: seeds ?? [],
        boardId,
        display: shuffleId(boardId),
      };
    }

    case "shuffle": {
      return {
        ...state,
        display: shuffleId(state.boardId),
      };
    }

    default: {
      return neverGuard(action, state);
    }
  }
};

export const BoardProvider = ({
  children,
  boardId: initialBoardId,
  seeds: initialSeeds,
}: Props) => {
  const { words: wordBank } = useWords();
  const { puzzleId, random } = usePuzzleId();

  const [{ boardId: id, seeds, display }, dispatch] = useReducer(reducer, {
    boardId: initialBoardId ?? "",
    seeds: initialSeeds ?? [],
    display: initialBoardId ?? "",
  } satisfies State);

  const shuffle = useCallback(() => {
    dispatch({ action: "shuffle" });
  }, []);

  const solve = useCallback(() => {
    if (!isLetters(id)) {
      throw new Error("I don't know what's going on.");
    }

    const letters = id as Letter[];

    const sideA = new Set<Letter>(letters.slice(0, 3));
    const sideB = new Set<Letter>(letters.slice(3, 6));
    const sideC = new Set<Letter>(letters.slice(6, 9));
    const sideD = new Set<Letter>(letters.slice(9));

    return findSolution(wordBank, {
      sideA,
      sideB,
      sideC,
      sideD,
      sequence: letters,
    });
  }, [id, wordBank]);

  const prevPuzzleId = useRef<string>();

  useEffect(() => {
    if (puzzleId.length === 12 && puzzleId.split("").every(isLetter)) {
      dispatch({ action: "set-board", boardId: puzzleId });
      return;
    }

    if (puzzleId === prevPuzzleId.current) {
      return;
    }
    prevPuzzleId.current = puzzleId;

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

    dispatch({
      action: "set-board",
      boardId: boardId(boards[0]),
      seeds: words,
    });
  }, [puzzleId, random, wordBank]);

  if (!display) {
    return <Loader text="generere puslespill ..." />;
  }

  return (
    <BoardContext.Provider
      key={id}
      value={{ id, shuffle, solve, seeds, display }}
    >
      {children}
    </BoardContext.Provider>
  );
};
