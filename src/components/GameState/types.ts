import { isLetters } from "../../types";
import { ValidationError } from "./context";

export type Reveal = "hidden" | "blocks" | "first-letters" | "full";

export type State = {
  words: string[];
  current: string;
  error: ValidationError | undefined;
  solved: boolean;
  reveal: Reveal;
} & {
  restoreComplete: boolean;
};

export type SavedState = Pick<State, "words" | "solved" | "reveal">;

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
    !(
      v.revealed === "hidden" ||
      v.revealed === "blocks" ||
      v.revealed === "first-letters" ||
      v.revealed === "full"
    )
  ) {
    return false;
  }

  return true;
};
