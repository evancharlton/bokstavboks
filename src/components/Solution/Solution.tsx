import { MdFilterList, MdOutlineCancel } from "react-icons/md";
import { useGameState } from "../GameState";
import { Loader } from "../Loader";
import { useSolution } from "../SolutionProvider";
import { WordList } from "../WordList";
import classes from "./Solution.module.css";

const format = (n: number): string => {
  const out: string[] = [];
  const str = String(n);
  for (let i = 0; i < str.length; i += 1) {
    if (i > 0 && i % 3 === 0) {
      out.unshift(" ");
    }
    out.unshift(str[str.length - 1 - i]);
  }
  return out.join("");
};

export const Solution = () => {
  const { solution, status, solve, abort, queueSize } = useSolution();
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
          <div className={classes.info}>
            <button onClick={abort}>
              <MdOutlineCancel /> Avbryt
            </button>
            <span>{format(queueSize)} gjenstår</span>
          </div>
        </Loader>
      )}
      <WordList path={solution} />
    </div>
  );
};
