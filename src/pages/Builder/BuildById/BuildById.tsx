import { useState } from "react";
import { PuzzleIdProvider } from "../../../components/PuzzleIdProvider";
import { BoardProvider } from "../../../components/BoardProvider";
import { GameState } from "../../../components/GameState";
import { StorageSandbox } from "../../../useStorage";
import { isLetters } from "../../../types";
import { Solution } from "../../../components/Solution";
import { SolutionProvider } from "../../../components/SolutionProvider";

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
              .replace(/[^abcdefghijklmnopqrstuvwxyzåæø]/g, ""),
          )
        }
        maxLength={12}
      />
      {ready && (
        <StorageSandbox version="builder">
          <PuzzleIdProvider puzzleId={id}>
            <BoardProvider>
              <SolutionProvider>
                <GameState>
                  <Solution />
                </GameState>
              </SolutionProvider>
            </BoardProvider>
          </PuzzleIdProvider>
        </StorageSandbox>
      )}
    </div>
  );
};
