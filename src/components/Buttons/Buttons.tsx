import {
  MdOutlineBackspace,
  MdKeyboardReturn,
  MdOutlineRestartAlt,
} from "react-icons/md";
import { useGameState } from "../GameState";
import classes from "./Buttons.module.css";

export const Buttons = () => {
  const { remove, reset, commit, revealed } = useGameState();

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <button disabled={revealed} onClick={() => reset()}>
          <MdOutlineRestartAlt />
        </button>
        <button disabled={revealed} onClick={() => remove()}>
          <MdOutlineBackspace />
        </button>
        <button disabled={revealed} onClick={() => commit()}>
          <MdKeyboardReturn />
        </button>
      </div>
    </div>
  );
};
