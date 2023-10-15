export type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "ø"
  | "æ"
  | "å";

const LETTERS: Record<string, true> = {
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
  ø: true,
  æ: true,
  å: true,
} as const;

export const isLetter = (l: string): l is Letter => {
  if (l.length !== 1) {
    return false;
  }
  return LETTERS[l];
};

export type Board = {
  sequence: Letter[];
  top: Set<Letter>;
  left: Set<Letter>;
  right: Set<Letter>;
  bottom: Set<Letter>;
};
