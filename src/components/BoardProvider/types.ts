export type State = {
  id: string;
  solution: string[]; // Shortest solution
  display: string;
  state: "solving" | "solved" | "pending";
  solvingPromise: Promise<unknown> | undefined;
};

export type SavedState = Pick<State, "id" | "solution">;

export const isSavedState = (v: unknown): v is SavedState => {
  if (!v) {
    return false;
  }
  return true;
};
