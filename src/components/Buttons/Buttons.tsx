import {
  MdOutlineBackspace,
  MdKeyboardReturn,
  MdOutlineRestartAlt,
} from "react-icons/md";
import { useGameState } from "../GameState";
import classes from "./Buttons.module.css";

export const Buttons = () => {
  const { remove, reset, commit, reveal } = useGameState();

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <button disabled={reveal === "full"} onClick={() => reset()}>
          <MdOutlineRestartAlt />
        </button>
        <button disabled={reveal === "full"} onClick={() => remove()}>
          <MdOutlineBackspace />
        </button>
        <button disabled={reveal === "full"} onClick={() => commit()}>
          <MdKeyboardReturn />
        </button>
      </div>
    </div>
  );
};
