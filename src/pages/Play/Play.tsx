import { Grid } from "../../components/Grid";
import { GameState } from "../../components/GameState";
import { BoardProvider } from "../../components/BoardProvider";
import { Status } from "../../components/Status";
import classes from "./Play.module.css";
import { Buttons } from "../../components/Buttons";
import { PuzzleIdProvider } from "../../components/PuzzleIdProvider";
import { Dialogs } from "../../components/Dialogs";
import { SolutionProvider } from "../../components/SolutionProvider";
import { GameHistoryProvider } from "../../components/GameHistoryProvider";
import { HamburgerMenu } from "../../components/Dialogs/HamburgerMenu";

export const Play = () => {
  return (
    <PuzzleIdProvider>
      <BoardProvider>
        <SolutionProvider>
          <GameHistoryProvider>
            <GameState>
              <Dialogs>
                <HamburgerMenu />
                <div className={classes.container}>
                  <Status />
                  <Grid />
                  <Buttons />
                </div>
              </Dialogs>
            </GameState>
          </GameHistoryProvider>
        </SolutionProvider>
      </BoardProvider>
    </PuzzleIdProvider>
  );
};
