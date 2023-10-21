export type State = {
  id: string;
  solution: string[]; // Shortest solution
  display: string;
};

export type SavedState = Pick<State, "id" | "solution">;

export const isSavedState = (v: unknown): v is SavedState => {
  if (!v) {
    return false;
  }
  return true;
};
