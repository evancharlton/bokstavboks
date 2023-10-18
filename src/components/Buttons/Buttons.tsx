import {
  MdOutlineBackspace,
  MdKeyboardReturn,
  MdOutlineRestartAlt,
} from "react-icons/md";
import { useGameState } from "../GameState";
import classes from "./Buttons.module.css";

export const Buttons = () => {
  const { remove, reset, commit, complete } = useGameState();

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <button disabled={!!complete} onClick={() => reset()}>
          <MdOutlineRestartAlt />
        </button>
        <button disabled={!!complete} onClick={() => remove()}>
          <MdOutlineBackspace />
        </button>
        <button disabled={!!complete} onClick={() => commit()}>
          <MdKeyboardReturn />
        </button>
      </div>
    </div>
  );
};
