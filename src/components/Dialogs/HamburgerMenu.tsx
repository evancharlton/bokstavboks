import {
  MdOutlineClose,
  MdOutlineDoneAll,
  MdLink,
  MdOutlineAutorenew,
  MdSettings,
  MdOutlineInfo,
  MdOutlineRefresh,
} from "react-icons/md";
import { useBoard } from "../BoardProvider";
import { useGameHistory } from "../GameHistoryProvider";
import { ShareButton } from "../ShareButton";
import { useDialog } from "./context";
import classes from "./HamburgerMenu.module.css";
import { WordList } from "../WordList";
import { useGameState } from "../GameState";
import { createShareString } from "../../utils";
import { useSolution } from "../SolutionProvider";

export const HamburgerMenu = () => {
  const { solutions } = useGameHistory();
  const { hide, show } = useDialog();
  const { randomize, url } = useBoard();
  const { words, current, reset, ideas, reveal, solved } = useGameState();
  const { solution } = useSolution();

  return (
    <dialog
      ref={(ref) => {
        ref?.showModal();
      }}
      onClose={() => hide()}
      className={classes.hamburger}
    >
      <div className={classes.header}>
        <button onClick={() => hide()}>
          <MdOutlineClose />
        </button>
      </div>
      <div className={classes.menuItem}>
        <button
          onClick={() => {
            reset();
            hide();
          }}
          disabled={words.length === 0 && current.length === 0}
        >
          <MdOutlineRefresh />
          Start på nytt
        </button>
      </div>
      <div className={classes.menuItem}>
        <ShareButton text={() => url} CopyIcon={MdLink}>
          Del puslespill
        </ShareButton>
      </div>
      <div className={classes.previousSolutions}>
        {solutions.map(({ words }) => (
          <div className={classes.menuItem} key={words.join("-")}>
            <ShareButton
              text={() =>
                createShareString(
                  {
                    words,
                    ideas,
                    reveal,
                    solved,
                  },
                  url,
                  solution
                )
              }
            />
            <WordList className={classes.previousSolution} path={words} />
          </div>
        ))}
      </div>
      <div className={classes.menuItem}>
        <button onClick={() => show("solve")}>
          <MdOutlineDoneAll /> Vis den beste løsningen
        </button>
      </div>
      <div className={classes.menuItem}>
        <button
          onClick={() => {
            hide();
            randomize();
          }}
        >
          <MdOutlineAutorenew /> Nytt puslespill
        </button>
      </div>
      <div className={classes.menuItem}>
        <button onClick={() => show("settings")}>
          <MdSettings /> Instillinger
        </button>
      </div>
      <div className={classes.menuItem}>
        <button onClick={() => show("about")}>
          <MdOutlineInfo /> Om Bokstavboks
        </button>
      </div>
    </dialog>
  );
};
