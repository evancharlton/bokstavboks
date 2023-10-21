import { isLetters } from "../../types";
import { ValidationError } from "./context";

export type State = {
  words: string[];
  current: string;
  error: ValidationError | undefined;
  solved: boolean;
  revealed: boolean;
} & {
  restoreComplete: boolean;
};

export type SavedState = Pick<State, "words" | "solved" | "revealed">;

export const isSavedState = (v: unknown): v is SavedState => {
  if (!v) {
    return false;
  }

  if (typeof v !== "object") {
    return false;
  }

  if (!("solved" in v) || !("revealed" in v) || !("words" in v)) {
    return false;
  }

  const { words } = v;
  if (!Array.isArray(words) || !words.every((entry) => isLetters(entry))) {
    return false;
  }

  if (typeof v.solved !== "boolean" || typeof v.revealed !== "boolean") {
    return false;
  }

  return true;
};
