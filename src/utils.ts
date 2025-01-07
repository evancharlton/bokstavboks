import { isLetters } from "./types";
import { GameStateType } from "./components/GameState";

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

export const createShareString = (
  {
    ideas,
    words,
    reveal,
    solved,
  }: Pick<GameStateType, "ideas" | "words" | "reveal" | "solved">,
  url: string,
  solution: string[],
) => {
  const revealed = reveal === "full";
  if (!(revealed || solved)) {
    return "";
  }

  const header = (() => {
    if (revealed && solved) {
      return `Løste ${solution.length}-ordsoppgave med ${words.length} ord!`;
    } else if (revealed) {
      return `Sitter fast på ${words.length} ord.`;
    } else {
      return `Løst med ${words.length} ord!`;
    }
  })();

  return [
    header,
    words
      .map((word) => {
        return [
          ideas[word] ? "💡" : "",
          ...word.split("").map(() => "⬛"),
        ].join("");
      })
      .join(" • "),
    "",
    url,
  ].join("\n");
};
