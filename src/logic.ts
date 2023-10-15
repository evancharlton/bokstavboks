import { Board, Letter } from "./types";

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

  // Make sure that it's walkable.
  let currentSide: keyof typeof ALLOWED_STEPS = "top";
  sequenceLoop: for (let i = 1; i < board.sequence.length; i += 1) {
    if (board.sequence[i] === board.sequence[i - 1]) {
      continue;
    }
    const letter = board.sequence[i];
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
