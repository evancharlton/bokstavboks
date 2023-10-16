import { Grid } from "../../components/Grid";
import { useGameState } from "../../components/GameState";
import { useBoard } from "../../components/BoardProvider";

export const Play = () => {
  const { shuffle, display, solve } = useBoard();
  const { current, add, commit, error, words: path } = useGameState();

  return (
    <div>
      <h3>{error}</h3>
      <h3>{path.join(" - ")}</h3>
      <code>{display}</code>
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
      <Grid input={current} />
      <button
        onClick={() => {
          try {
            const solution = solve();
            alert(solution.join(" + "));
          } catch (ex) {
            alert("Couldn't find a solution");
          }
        }}
      >
        Solve
      </button>
      <button onClick={() => shuffle()}>shuffle</button>
    </div>
  );
};
