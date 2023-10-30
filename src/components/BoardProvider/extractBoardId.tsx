import { createBoard, addLetter } from "../../logic";
import { isLetter, Letter, boardId } from "../../types";

export const extractBoardId = async (
  puzzleId: string,
  random: () => number,
  wordBank: string[]
): Promise<string> => {
  if (puzzleId.length === 12 && puzzleId.split("").every(isLetter)) {
    return puzzleId;
  }

  const next = (dict: string[]) => dict[Math.floor(random() * dict.length)];
  const letterCounts = new Map<string, number>();
  for (const word of wordBank) {
    letterCounts.set(word, new Set(word).size);
  }

  while (true) {
    const words: string[] = [];
    const letterSet = new Set<string>();
    do {
      const last =
        words.length === 0 ? next(wordBank) : words[words.length - 1];
      const scopedWords = wordBank
        .filter((w) => w[0] === last[last.length - 1])
        .filter((w) => {
          let extraLetters = 0;
          for (const char of w) {
            if (!letterSet.has(char)) {
              extraLetters += 1;
            }
          }
          return letterSet.size + extraLetters <= 12;
        });
      const chosenWord = next(scopedWords);
      words.push(chosenWord);
      for (const letter of chosenWord) {
        letterSet.add(letter);
      }
    } while (letterSet.size < 12);

    const [first, ...rest] = words.join("") as unknown as Letter[];
    let boards = [createBoard(first)];
    for (const letter of rest) {
      boards = addLetter(boards, letter);
    }

    if (boards.length > 0) {
      return boardId(boards[0]);
    }

    // Loop around again
  }
};
