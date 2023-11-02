import { neverGuard } from "../../types";
import { useGameState } from "../GameState";
import { useSolution } from "../SolutionProvider";
import { WordList } from "../WordList";
import classes from "./Solution.module.css";
import { CSSProperties, useMemo } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

export const Solution = ({ style }: Props) => {
  const { solution } = useSolution();
  const { solved, reveal } = useGameState();

  const solutionPath = useMemo(() => {
    switch (reveal) {
      case "hidden": {
        return null;
      }

      case "blocks": {
        return solution.map((word) => {
          return new Array(word.length).fill("◼️").join("");
        });
      }

      case "first-letters": {
        return solution.map((word, i, data) => {
          const blocks = new Array(word.length).fill("◼️");
          blocks[0] = word[0];
          if (i < data.length - 1) {
            blocks[blocks.length - 1] = word[word.length - 1];
          }
          return blocks.join("");
        });
      }

      case "full": {
        return solution;
      }

      default: {
        return neverGuard(reveal, null);
      }
    }
  }, [reveal, solution]);

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
