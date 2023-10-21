import { isLetters } from "./types";

export const normalizeId = (id: string): string => {
  if (id.length !== 12) {
    throw new Error("Expecting exactly 12 letters");
  }

  if (new Set(id).size !== 12) {
    throw new Error("Expecting exactly 12 unique letters");
  }

  if (!isLetters(id)) {
    throw new Error("Unexpected letters");
  }

  return [
    id.substring(0, 3),
    id.substring(3, 6),
    id.substring(6, 9),
    id.substring(9),
  ]
    .map((side) => side.split("").sort().join(""))
    .sort()
    .join("");
};
