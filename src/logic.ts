import PriorityQueue from "ts-priority-queue";
import { Board, Letter, isLetter } from "./types";

export const createBoard = (start: Letter): Board => {
  return {
    sequence: [start],
    top: new Set([start]),
    left: new Set(),
    right: new Set(),
    bottom: new Set(),
  };
};

const ALLOWED_STEPS = {
  top: ["left", "right", "bottom"],
  left: ["top", "right", "bottom"],
  right: ["top", "left", "bottom"],
  bottom: ["top", "left", "right"],
} as const;

export const isLegalBoard = (input: unknown): input is Board => {
  if (!input) {
    return false;
  }

  const board = input as Board;

  {
    const sequenceLetters = new Set(board.sequence);
    const representedLetters = new Set([
      ...board.top,
      ...board.left,
      ...board.right,
      ...board.bottom,
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

  const isComplete = new Set(board.sequence).size === 12;
  if (isComplete) {
    throw new Error(`Cannot add to ${next} to a complete board`);
  }

  return [
    board.top.size < 3 && {
      ...board,
      sequence: [...board.sequence, next],
      top: new Set([...board.top, next]),
    },
    board.left.size < 3 && {
      ...board,
      sequence: [...board.sequence, next],
      left: new Set([...board.left, next]),
    },
    board.right.size < 3 && {
      ...board,
      sequence: [...board.sequence, next],
      right: new Set([...board.right, next]),
    },
    board.bottom.size < 3 && {
      ...board,
      sequence: [...board.sequence, next],
      bottom: new Set([...board.bottom, next]),
    },
  ].filter(isLegalBoard);
};

export const canPlay = (board: Board, word: Letter[]): boolean => {
  // Make sure that it's walkable.
  let currentSide: keyof typeof ALLOWED_STEPS = "top";
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

export const aStar = (words: string[]) => {
  const letters = new Map<string, number>();
  words.forEach((word) => {
    letters.set(word, new Set(word.split("")).size);
  });

  const h = (word: string) => {
    return 12 - (letters.get(word) ?? 0);
  };

  const pSet = new Set<string>();
  const pQueue = new PriorityQueue<string>({
    comparator: (a, b) => {
      return (
        (letters.get(b) ?? Number.MAX_SAFE_INTEGER) -
        (letters.get(a) ?? Number.MAX_SAFE_INTEGER)
      );
    },
  });
  pSet.add("");
  pQueue.queue("");

  const cameFrom = new Map<string, string>();

  const reconstructPath = (word: string): string[] => {
    const path = [];
    let current = word;
    do {
      path.push(current);
      const next = cameFrom.get(current);
      if (!next) {
        return path;
      }
      current = next;
    } while (true);
  };

  const isFinished = (path: string[]): boolean => {
    return new Set(path.join("").split("")).size === 12;
  };

  const gScore = {
    _map: new Map<string, number>(),
    get(word: string): number {
      return this._map.get(word) ?? Number.MAX_SAFE_INTEGER;
    },
    set(word: string, score: number) {
      this._map.set(word, score);
    },
  };
  gScore.set("", 0);

  const fScore = {
    _map: new Map<string, number>(),
    get(word: string): number {
      return this._map.get(word) ?? Number.MAX_SAFE_INTEGER;
    },
    set(word: string, score: number) {
      this._map.set(word, score);
    },
  };
  fScore.set("", h(""));

  const d = (a: string, b: string): number => {
    return 12 - new Set(`${a}${b}`.split("")).size;
  };

  while (pQueue.length > 0) {
    const current = pQueue.dequeue();
    pSet.delete(current);
    const path = reconstructPath(current);
    if (isFinished(path)) {
      return path;
    }

    const neighbors = words.filter((w) => {
      return !current || w.startsWith(current);
    });

    for (const neighbor of neighbors) {
      const tentativeG = gScore.get(current) + d(current, neighbor);
      if (tentativeG < gScore.get(neighbor)) {
        // This is better.
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeG);
        fScore.set(neighbor, tentativeG + h(neighbor));
        if (!pSet.has(neighbor)) {
          pQueue.queue(neighbor);
          pSet.add(neighbor);
        }
      }
    }
  }

  throw new Error("No matches found");
};

export const findSolution = (words: string[], board: Board): string[] => {
  const possibleLetters = new Set(board.sequence);
  const contenders = words.filter((word) => {
    for (const letter of word) {
      if (!possibleLetters.has(letter as Letter)) {
        return false;
      }
    }
    return !canPlay(board, word.split("").filter(isLetter));
  });

  return aStar(contenders);
};
