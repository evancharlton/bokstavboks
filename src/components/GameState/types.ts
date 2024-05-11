import { isLetters } from "../../types";
import { ValidationError } from "./context";

export type Reveal = "hidden" | "full";

export type Hints = {
  blocks: boolean;
  colors: boolean;
  starts: number;
};

export type State = {
  words: string[];
  current: string;
  error: ValidationError | undefined;
  solved: boolean;
  reveal: Reveal;
  hints: Hints;
} & {
  restoreComplete: boolean;
};

export type SavedState = Pick<State, "words" | "solved" | "reveal" | "hints">;

const KNOWN_REVEALED: Record<string, true> = {
  hidden: true,
  blocks: true,
  colors: true,
  "first-letters": true,
  full: true,
};

export const isSavedState = (v: unknown): v is SavedState => {
  if (!v) {
    return false;
  }

  if (typeof v !== "object") {
    return false;
  }

  if (!("solved" in v) || !("words" in v)) {
    return false;
  }

  const { words } = v;
  if (!Array.isArray(words) || !words.every((entry) => isLetters(entry))) {
    return false;
  }

  if (typeof v.solved !== "boolean") {
    return false;
  }

  if (
    "revealed" in v &&
    !KNOWN_REVEALED[v.revealed as keyof typeof KNOWN_REVEALED]
  ) {
    return false;
  }

  return true;
};
