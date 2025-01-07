import { Board, Letter } from "./types";
import { normalizeId } from "./utils";

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
  next: Letter,
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

export const findSolution = async (
  words: readonly string[],
  board: Board,
): Promise<string[]> => {
  return findSolutionById(
    words,
    [...board.sideA, ...board.sideB, ...board.sideC, ...board.sideD].join(""),
    null as unknown as AbortSignal,
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
export const bfs = async (
  words: string[],
  id: string,
  abortSignal: AbortSignal,
  onSolution: (solution: string[]) => void,
  onProgress: (queueSize: number) => void,
): Promise<string[]> => {
  const translate = (ids: number[]): string[] => ids.map((id) => words[id]);

  const finalLetters = new Uint8Array(
    words.map((w) => w.charCodeAt(w.length - 1)),
  );
  const wordsByStartLetter = new Map<number, number[]>();
  const singleWordSolutions: string[] = [];
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const a = word.charCodeAt(0);
    if (!wordsByStartLetter.has(a)) {
      wordsByStartLetter.set(a, []);
    }
    wordsByStartLetter.get(a)?.push(i);
    const length = new Set(word).size;

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

  const bits = new Uint16Array(
    words.map((word) => {
      let mask: number = 0;
      for (let i = 0; i < id.length; i += 1) {
        if (word.includes(id[i])) {
          mask |= 1 << i;
        }
      }
      return mask;
    }),
  );

  const queue: number[][] = words.map((_, i) => [i]);
  const solutions: number[][] = [];
  let i = 0;
  while (queue.length > 0) {
    if (abortSignal?.aborted) {
      return [];
    }

    const path = queue.shift();
    if (!path) {
      break; // We're done
    }

    if (i++ % 1_000 === 0) {
      onProgress(queue.length);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    if (path.length >= 4) {
      throw new Error("no solution found within 4 words");
    }

    if (solutions.length > 0) {
      if (path.length >= solutions[0].length) {
        break;
      }
    }

    const finalWordId = path[path.length - 1];
    const finalLetter = finalLetters.at(finalWordId);
    if (!finalLetter) {
      throw new Error("Last letter couldn't be found");
    }

    const nextWordIds = wordsByStartLetter.get(finalLetter);
    if (!nextWordIds) {
      continue;
    }

    let currentMask = 0;
    for (const wordIndex of path) {
      currentMask |= bits.at(wordIndex) ?? 0;
    }

    for (const nextWordId of nextWordIds) {
      const nextMask = bits.at(nextWordId) ?? 0;
      if ((currentMask | nextMask) === 0b111111111111) {
        const nextPath = [...path, nextWordId];
        solutions.push(nextPath);
        onSolution(translate(nextPath));
      } else {
        if (solutions.length === 0) {
          const nextPath = [...path, nextWordId];
          queue.push(nextPath);
        }
      }
    }
  }

  if (solutions.length === 0) {
    throw new Error("no solution found");
  }

  const [shortest] = solutions
    .map(translate)
    .sort((a, b) => a.join("").length - b.join("").length);

  return shortest;
};

export const findSolutionById = (
  words: readonly string[],
  rawBoardId: string,
  abortSignal: AbortSignal,
  onSolution: (solution: string[]) => void = () => undefined,
  onProgress: (queueSize: number) => void = () => undefined,
) => {
  const boardId = normalizeId(rawBoardId);

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

  return bfs(contenders, boardId, abortSignal, onSolution, onProgress);
};
