import { useGameState } from "../GameState";
import { useSolution } from "../SolutionProvider";
import { WordList } from "../WordList";
import classes from "./Solution.module.css";
import { CSSProperties } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
};

export const Solution = ({ style }: Props) => {
  const { solution } = useSolution();
  const { solved } = useGameState();

  return (
    <div
      className={[classes.container, solved && classes.solved]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <WordList path={solution} />
    </div>
  );
};
