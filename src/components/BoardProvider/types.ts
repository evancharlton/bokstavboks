export type GroupId = 0 | 1 | 2 | 3;

export type State = {
  id: string;
  display: string;
  groups: Readonly<
    [
      GroupId, // top
      GroupId, // right
      GroupId, // bottom
      GroupId, // left
    ]
  >;
};

export type SavedState = Pick<State, "id">;

export const isSavedState = (v: unknown): v is SavedState => {
  if (!v) {
    return false;
  }
  return true;
};
