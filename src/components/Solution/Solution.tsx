import { useBoard } from "../BoardProvider";
import { useGameState } from "../GameState";
import { useSolution } from "../SolutionProvider";
import { WordList } from "../WordList";
import classes from "./Solution.module.css";
import { CSSProperties, useMemo } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

const SQUARES = ["🟨", "🟩", "🟦", "🟥"] as const;

const colorize = (word: string, id: string) => {
  const out: string[] = [];
  for (let i = 0; i < word.length; i += 1) {
    const letter = word[i];
    const index = id.indexOf(letter);
    const sideIndex = Math.floor(index / 3);
    out.push(SQUARES[sideIndex % SQUARES.length]);
  }
  return out;
};

export const Solution = ({ style }: Props) => {
  const { solution } = useSolution();
  const { solved, reveal, hints } = useGameState();
  const { id } = useBoard();

  const solutionPath = useMemo(() => {
    if (reveal === "full") {
      return solution;
    }

    if (hints.colors) {
      return solution.map((word, i, data) => {
        const blocks = hints.colors
          ? colorize(word, id)
          : new Array(word.length).fill("◼️");
        for (let j = 0; j < hints.starts; j += 1) {
          blocks[j] = word[j];
          if (i < data.length - 1) {
            const fromEnd = word.length - 1 - j;
            blocks[fromEnd] = word[fromEnd];
          }
        }
        return blocks.join("");
      });
    }

    if (hints.blocks) {
      return solution.map((word) => {
        return new Array(word.length).fill("◼️").join("");
      });
    }

    return null;
  }, [reveal, hints, id, solution]);

  if (!solutionPath) {
    return null;
  }

  return (
    <div
      key={reveal}
      className={[classes.container, solved && classes.solved]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <WordList path={solutionPath} />
    </div>
  );
};
