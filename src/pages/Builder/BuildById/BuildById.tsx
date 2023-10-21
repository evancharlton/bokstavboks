import { useEffect, useState } from "react";
import { PuzzleIdProvider } from "../../../components/PuzzleIdProvider";
import { BoardProvider, useBoard } from "../../../components/BoardProvider";
import { GameState } from "../../../components/GameState";
import { StorageSandbox } from "../../../useStorage";
import { WordList } from "../../../components/WordList";
import { isLetters } from "../../../types";
import { Loader } from "../../../components/Loader";

const Solution = () => {
  const { id, solve, solution, state } = useBoard();

  useEffect(() => {
    solve();
  }, [id, solve]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {state === "solving" && <Loader text="finne den optimale løsningen..." />}
      <code>{state}</code>
      <WordList path={solution} />
    </div>
  );
};

export const BuildById = () => {
  const [id, setId] = useState("");

  const ready = id.length === 12 && isLetters(id) && new Set(id).size === 12;

  return (
    <div>
      <input
        type="text"
        value={id}
        onChange={(e) =>
          setId(
            e.target.value
              .toLocaleLowerCase()
              .replace(/[^abcdefghijklmnopqrstuvwxyzåæø]/g, "")
          )
        }
        maxLength={12}
      />
      {ready && (
        <StorageSandbox version="builder">
          <PuzzleIdProvider puzzleId={id}>
            <BoardProvider>
              <GameState>
                <Solution />
              </GameState>
            </BoardProvider>
          </PuzzleIdProvider>
        </StorageSandbox>
      )}
    </div>
  );
};
