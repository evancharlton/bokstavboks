export type State = {
  id: string;
  display: string;
};

export type SavedState = Pick<State, "id">;

export const isSavedState = (v: unknown): v is SavedState => {
  if (!v) {
    return false;
  }
  return true;
};
