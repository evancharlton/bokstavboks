import { Grid } from "../../components/Grid";
import { GameState } from "../../components/GameState";
import { BoardProvider } from "../../components/BoardProvider";
import { Status } from "../../components/Status";
import classes from "./Play.module.css";
import { Buttons } from "../../components/Buttons";
import { Header } from "../../components/Header";
import { Page } from "../../components/Page";
import { PuzzleIdProvider } from "../../components/PuzzleIdProvider";
import { Dialogs } from "../../components/Dialogs";
import { SolutionProvider } from "../../components/SolutionProvider";
import { GameHistoryProvider } from "../../components/GameHistoryProvider";

export const Play = () => {
  return (
    <PuzzleIdProvider>
      <BoardProvider>
        <SolutionProvider>
          <GameHistoryProvider>
            <GameState>
              <Dialogs>
                <Page header={<Header />}>
                  <div className={classes.container}>
                    <Status />
                    <Grid />
                    <Buttons />
                  </div>
                </Page>
              </Dialogs>
            </GameState>
          </GameHistoryProvider>
        </SolutionProvider>
      </BoardProvider>
    </PuzzleIdProvider>
  );
};
