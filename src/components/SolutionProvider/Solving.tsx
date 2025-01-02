import { Loader } from "../../spa-components/Loader";
import classes from "./Solving.module.css";

type Props = {
  progress: number;
  onNewPuzzle: () => void;
};

export const Solving = ({ progress, onNewPuzzle }: Props) => {
  return (
    <div className={classes.outerContainer}>
      <div className={classes.container}>
        <Loader text="løser puslespill ..." />
        <progress max={1} value={Number.isNaN(progress) ? 0 : progress} />
        <button onClick={onNewPuzzle}>Annerledes pusle</button>
      </div>
    </div>
  );
};
