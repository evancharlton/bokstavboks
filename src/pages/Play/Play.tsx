import { Grid } from "../../components/Grid";
import { useGameState } from "../../components/GameState";
import { useBoard } from "../../components/BoardProvider";
import { useEffect } from "react";
import { Status } from "../../components/Status";
import classes from "./Play.module.css";
import { Toast } from "../../components/Toast";
import { Buttons } from "../../components/Buttons";

export const Play = () => {
  const { display } = useBoard();
  const { commit, remove, add, complete } = useGameState();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (complete) {
        return;
      }

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
  }, [add, commit, complete, display, remove]);

  return (
    <div className={classes.container}>
      <Status />
      <Grid />
      <Buttons />
      <Toast />
    </div>
  );
};
