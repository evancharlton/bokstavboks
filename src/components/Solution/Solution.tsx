import { MdFilterList, MdOutlineCancel } from "react-icons/md";
import { useGameState } from "../GameState";
import { Loader } from "../Loader";
import { useSolution } from "../SolutionProvider";
import { WordList } from "../WordList";
import classes from "./Solution.module.css";

export const Solution = () => {
  const { solution, status, solve, abort } = useSolution();
  const { revealed } = useGameState();

  if (status === "pending") {
    if (revealed) {
      return (
        <button className={classes.solve} style={{ margin: 8 }} onClick={solve}>
          <MdFilterList /> Finn løsning
        </button>
      );
    }
    return null;
  }

  if (status === "impossible") {
    return null; // TODO
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {status === "solving" && (
        <Loader
          className={classes.loader}
          text="finne den korteste løsningen..."
        >
          <button onClick={abort}>
            <MdOutlineCancel /> Avbryt
          </button>
        </Loader>
      )}
      <WordList path={solution} />
    </div>
  );
};
