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
        <button
          title="Start på nytt"
          disabled={frozen || reveal === "full"}
          onClick={() => reset()}
        >
          <MdOutlineRestartAlt />
        </button>
        <button
          title="Gi en idé"
          disabled={frozen || reveal === "full" || current.length > 1}
          onClick={() => provideIdea()}
        >
          <MdOutlineLightbulb />
        </button>
        <button
          title="Fjern den siste bokstaven"
          disabled={frozen || reveal === "full" || current.length === 0}
          onClick={() => remove()}
        >
          <MdOutlineBackspace />
        </button>
        <button
          title="Legg til"
          disabled={frozen || reveal === "full" || current.length < 3}
          onClick={() => commit()}
        >
          <MdKeyboardReturn />
        </button>
      </div>
    </div>
  );
};
