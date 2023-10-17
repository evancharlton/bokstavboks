import { useBoard } from "../BoardProvider";
import { useGameState } from "../GameState";
import classes from "./Buttons.module.css";

export const Buttons = () => {
  const { solve } = useBoard();
  const { remove, reset, commit } = useGameState();

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <button onClick={() => reset()}>Start på nytt</button>
        <button onClick={() => remove()}>Fjern</button>
        <button onClick={() => commit()}>Bekreft</button>
      </div>
      <div className={classes.row}>
        <button
          onClick={() => {
            try {
              const solution = solve();
              alert(solution.join(" + "));
            } catch (ex) {
              alert("Couldn't find a solution");
            }
          }}
        >
          Solve
        </button>
      </div>
    </div>
  );
};
