export const LETTERS = {
  a: true,
  b: true,
  c: true,
  d: true,
  e: true,
  f: true,
  g: true,
  h: true,
  i: true,
  j: true,
  k: true,
  l: true,
  m: true,
  n: true,
  o: true,
  p: true,
  q: true,
  r: true,
  s: true,
  t: true,
  u: true,
  v: true,
  w: true,
  x: true,
  y: true,
  z: true,
  ø: true,
  æ: true,
  å: true,
} as const;

export type Letter = keyof typeof LETTERS;

export const isLetter = (l: string): l is Letter => {
  if (l.length !== 1) {
    return false;
  }
  return !!LETTERS[l as Letter];
};

export const isLetters = (l: unknown): l is Letter[] => {
  if (typeof l !== "string") {
    return false;
  }

  for (const c of l) {
    if (!isLetter(c)) {
      return false;
    }
  }
  return true;
};

type Side = Set<Letter>;

export type Board = {
  sequence: Letter[];
  sideA: Side;
  sideB: Side;
  sideC: Side;
  sideD: Side;
};

const serializeSide = (side: Side): string => {
  return `${[...side].sort().join("")}???`.substring(0, 3);
};

export const boardId = (board: Board): string => {
  return [board.sideA, board.sideB, board.sideC, board.sideD]
    .map((side) => serializeSide(side))
    .join("");
};

export const neverGuard = <T,>(_: never, v: T): T => {
  return v;
};
