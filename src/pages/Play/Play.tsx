import { useParams } from "react-router-dom";
import { useWords } from "../../components/WordsProvider";
import { useMemo, useState } from "react";
import { Board, LETTERS, Letter, isLetter } from "../../types";
import { addLetter, canPlay, createBoard, findSolution } from "../../logic";
import { Grid } from "../../components/Grid";
import { usePuzzleId } from "../../components/PuzzleIdProvider";
import { useBoard } from "../../components/BoardProvider";

export const Play = () => {
  const wordBank = useWords();

  const { puzzleHash } = usePuzzleId();
  const { board, words } = useBoard();

  const [input, setInput] = useState("");
  const [path, setWords] = useState<string[]>([]);

  if (!board) {
    return <p>Couldn't find a good board</p>;
  }

  return (
    <div>
      <h1>Playing #{puzzleHash}</h1>
      <pre>{JSON.stringify(path, null, 2)}</pre>
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setWords((w) => [...w, input]);
            setInput(input[input.length - 1]);
          }
        }}
        onChange={(e) => {
          setInput(() => {
            const value = e.target.value;
            const [prev, last] = (() => {
              const prev = (value[value.length - 2] ?? "") as Letter;
              const last = value[value.length - 1] as Letter;
              return [
                board.top.has(prev)
                  ? "top"
                  : board.left.has(prev)
                  ? "left"
                  : board.right.has(prev)
                  ? "right"
                  : board.bottom.has(prev)
                  ? "bottom"
                  : undefined,

                board.top.has(last)
                  ? "top"
                  : board.left.has(last)
                  ? "left"
                  : board.right.has(last)
                  ? "right"
                  : board.bottom.has(last)
                  ? "bottom"
                  : undefined,
              ];
            })();

            if (!last || last === prev) {
              return value.substring(0, value.length - 1);
            }

            return value;
          });
        }}
        pattern="^a"
        value={input}
      />
      <Grid board={board} input={input} />
      <pre>{JSON.stringify(words, null, 2)}</pre>
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
