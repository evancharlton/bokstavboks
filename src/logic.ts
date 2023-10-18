import PriorityQueue from "ts-priority-queue";
import { Board, Letter, isLetter } from "./types";

export const createBoard = (start: Letter): Board => {
  return {
    sequence: [start],
    sideA: new Set([start]),
    sideB: new Set(),
    sideC: new Set(),
    sideD: new Set(),
  };
};

export const initializeBoards = (start: string): Board[] => {
  const [first, ...rest] = start as unknown as Letter[];
  let boards = [createBoard(first)];
  for (const letter of rest) {
    boards = addLetter(boards, letter);
  }
  return boards;
};

export const addWord = (boards: Board[], word: string): Board[] => {
  let next = boards;
  for (const letter of word) {
    next = addLetter(next, letter as Letter);
  }
  return next;
};

const ALLOWED_STEPS = {
  sideA: ["sideB", "sideC", "sideD"],
  sideB: ["sideA", "sideC", "sideD"],
  sideC: ["sideA", "sideB", "sideD"],
  sideD: ["sideA", "sideB", "sideC"],
} as const;

export const isLegalBoard = (input: unknown): input is Board => {
  if (!input) {
    return false;
  }

  const board = input as Board;

  {
    const sequenceLetters = new Set(board.sequence);
    const representedLetters = new Set([
      ...board.sideA,
      ...board.sideB,
      ...board.sideC,
      ...board.sideD,
    ]);
    if (representedLetters.size !== sequenceLetters.size) {
      return false;
    }

    for (const letter of representedLetters.values()) {
      if (!sequenceLetters.has(letter)) {
        return false;
      }
    }
  }

  if (board.sequence.length === 1) {
    return true;
  }

  return canPlay(board, board.sequence);
};

export const isComplete = (board: Board): boolean => {
  return new Set(board.sequence).size === 12;
};

export const addLetter = (
  boardOrBoards: Board | Board[],
  next: Letter
): Board[] => {
  if (Array.isArray(boardOrBoards)) {
    return boardOrBoards.flatMap((board) => addLetter(board, next));
  }
  const board: Board = boardOrBoards;

  if (board.sequence.includes(next)) {
    return [{ ...board, sequence: [...board.sequence, next] }];
  }

  if (isComplete(board)) {
    throw new Error(`Cannot add to ${next} to a complete board`);
  }

  return [
    board.sideA.size < 3 && {
      ...board,
      sequence: [...board.sequence, next],
      sideA: new Set([...board.sideA, next]),
    },
    board.sideB.size < 3 && {
      ...board,
      sequence: [...board.sequence, next],
      sideB: new Set([...board.sideB, next]),
    },
    board.sideC.size < 3 && {
      ...board,
      sequence: [...board.sequence, next],
      sideC: new Set([...board.sideC, next]),
    },
    board.sideD.size < 3 && {
      ...board,
      sequence: [...board.sequence, next],
      sideD: new Set([...board.sideD, next]),
    },
  ].filter(isLegalBoard);
};

export const canPlay = (board: Board, word: Letter[]): boolean => {
  // Make sure that it's walkable.
  let currentSide: keyof typeof ALLOWED_STEPS = "sideA";
  sequenceLoop: for (let i = 1; i < word.length; i += 1) {
    if (word[i] === word[i - 1]) {
      continue;
    }
    const letter = word[i];
    let step: keyof typeof ALLOWED_STEPS;
    for (step of ALLOWED_STEPS[currentSide]) {
      const nextSide = board[step];
      if (nextSide.has(letter)) {
        // We found a step. We know that this is the only valid one because
        // each letter only exists on at most one side.
        currentSide = step;
        continue sequenceLoop;
      }
    }
    return false;
  }

  return true;
};

const isFinished = (path: string[]): boolean => {
  return new Set(path.join("").split("")).size === 12;
};

export const findSolution = (
  words: readonly string[],
  board: Board
): string[] => {
  return findSolutionById(
    words,
    [...board.sideA, ...board.sideB, ...board.sideC, ...board.sideD].join("")
  );
};

const canPlay2 = (sides: Record<string, string>, word: string): boolean => {
  if (word.length === 0) {
    return false;
  }

  if (word.length <= 1) {
    return !!sides[word];
  }

  for (let i = 1; i < word.length; i += 1) {
    const a = word[i - 1];
    const b = word[i];

    const sideA = sides[a];
    const sideB = sides[b];

    if (!sideA || !sideB) {
      return false;
    }

    if (sideA === sideB) {
      return false;
    }
  }
  return true;
};

// TODO: This is a bit inefficient, data-structure-wise. Let's see if we can
//       clean this up with some better structures.
export const bfs = (words: string[]): string[] => {
  const letters = new Map<string, number>();
  const wordsByLetter = new Map<string, string[]>();
  const singleWordSolutions: string[] = [];
  for (const word of words) {
    const a = word[0];
    if (!wordsByLetter.has(a)) {
      wordsByLetter.set(a, []);
    }
    wordsByLetter.get(a)?.push(word);
    const length = new Set(word).size;
    letters.set(word, length);

    if (length === 12) {
      // We found a single-word solution - awesome!
      singleWordSolutions.push(word);
    }
  }

  // See if we can short-cut the larger BFS.
  if (singleWordSolutions.length > 0) {
    const shortest = singleWordSolutions.sort((a, b) => a.length - b.length);
    return [shortest[0]];
  }

  wordsByLetter.forEach((words, k) => {
    wordsByLetter.set(
      k,
      words.sort(
        (a, b) =>
          (letters.get(b) ?? Number.MAX_SAFE_INTEGER) -
          (letters.get(a) ?? Number.MAX_SAFE_INTEGER)
      )
    );
  });

  const queue: string[][] = words.map((w) => [w]);
  const solutions: string[][] = [];
  while (queue.length > 0) {
    const path = queue.shift();
    if (!path) {
      continue;
    }

    if (solutions.length > 0 && path.length > solutions[0].length) {
      // We're into the losers
      break;
    }

    const finalWord = path[path.length - 1];
    const finalLetter = finalWord[finalWord.length - 1];

    const nextWords = wordsByLetter.get(finalLetter);
    if (!nextWords) {
      continue;
    }

    for (const nextWord of nextWords) {
      const nextPath = [...path, nextWord];
      if (new Set(nextPath.join("")).size === 12) {
        return nextPath;
      }
      queue.push(nextPath);
    }
  }

  if (solutions.length === 0) {
    throw new Error("no solution found");
  }

  const bestSolutions = solutions.sort((a, b) => {
    return a.join("").length - b.join("").length;
  });
  return bestSolutions[0];
};

export const findSolutionById = (words: readonly string[], boardId: string) => {
  const sides = {
    [boardId[0]]: "a",
    [boardId[1]]: "a",
    [boardId[2]]: "a",
    [boardId[3]]: "b",
    [boardId[4]]: "b",
    [boardId[5]]: "b",
    [boardId[6]]: "c",
    [boardId[7]]: "c",
    [boardId[8]]: "c",
    [boardId[9]]: "d",
    [boardId[10]]: "d",
    [boardId[11]]: "d",
  };

  const contenders = words.filter((word) => {
    return canPlay2(sides, word);
  });

  return bfs(contenders);
};
