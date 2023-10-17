import { Grid } from "../../components/Grid";
import { useGameState } from "../../components/GameState";
import { useBoard } from "../../components/BoardProvider";
import { useEffect } from "react";
import { Status } from "../../components/Status";
import classes from "./Play.module.css";
import { Toast } from "../../components/Toast";

export const Play = () => {
  const { shuffle, display, solve } = useBoard();
  const { commit, remove, add } = useGameState();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      const key = e.key;
      if (key === "Enter") {
        commit();
        return;
      }

      if (key === "Backspace" || key === "Delete") {
        remove();
        return;
      }

      if (key.length !== 1) {
        return;
      }

      if (!display.includes(key)) {
        return;
      }

      add(key);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [add, commit, display, remove]);

  return (
    <div className={classes.container}>
      <Status />
      <Grid />
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
      <button onClick={() => shuffle()}>shuffle</button>
      <Toast />
    </div>
  );
};
