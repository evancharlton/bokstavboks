import {
  MdOutlineBackspace,
  MdKeyboardReturn,
  MdOutlineRestartAlt,
  MdOutlineLightbulb,
} from "react-icons/md";
import { useGameState } from "../GameState";
import classes from "./Buttons.module.css";

export const Buttons = () => {
  const { frozen, remove, reset, commit, reveal, current, provideIdea } =
    useGameState();

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <button disabled={frozen || reveal === "full"} onClick={() => reset()}>
          <MdOutlineRestartAlt />
        </button>
        <button
          disabled={frozen || reveal === "full" || current.length > 1}
          onClick={() => provideIdea()}
        >
          <MdOutlineLightbulb />
        </button>
        <button disabled={frozen || reveal === "full"} onClick={() => remove()}>
          <MdOutlineBackspace />
        </button>
        <button disabled={frozen || reveal === "full"} onClick={() => commit()}>
          <MdKeyboardReturn />
        </button>
      </div>
    </div>
  );
};
