import { useWords } from "../../components/WordsProvider";
import { findSolution } from "../../logic";
import { Grid } from "../../components/Grid";
import { useBoard } from "../../components/BoardProvider";
import { useGameState } from "../../components/GameState";

export const Play = () => {
  const { words: wordBank } = useWords();
  const { board } = useBoard();
  const { current, add, commit, error, words: path } = useGameState();

  return (
    <div>
      <h3>{error}</h3>
      <h3>{path.join(" - ")}</h3>
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit();
          }
        }}
        onChange={(e) => {
          add(e.target.value);
        }}
        pattern="^a"
        value={current}
      />
      <Grid board={board} input={current} />
      <button
        onClick={() => {
          try {
            const solution = findSolution(wordBank, board);
            alert(solution.join(" + "));
          } catch (ex) {
            alert("Couldn't find a solution");
          }
        }}
      >
        Solve
      </button>
    </div>
  );
};
