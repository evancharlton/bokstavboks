import { Grid } from "../../components/Grid";
import { GameState, useGameState } from "../../components/GameState";
import { BoardProvider, useBoard } from "../../components/BoardProvider";
import { Status } from "../../components/Status";
import classes from "./Play.module.css";
import { Toast } from "../../components/Toast";
import { Buttons } from "../../components/Buttons";
import { MdOutlineDone, MdOutlineAutorenew } from "react-icons/md";
import { Header } from "../../components/Header";
import { Page } from "../../components/Page";
import { PuzzleIdProvider } from "../../components/PuzzleIdProvider";
import { WordsProvider } from "../../components/WordsProvider";
import { Dialogs, useDialog } from "../../components/Dialogs";
import { SolutionProvider } from "../../components/SolutionProvider";

const HeaderButtons = () => {
  const { randomize } = useBoard();
  const { revealed } = useGameState();
  const { show } = useDialog();

  return (
    <>
      {!revealed && (
        <button onClick={() => show("solve")}>
          <MdOutlineDone />
        </button>
      )}
      <button onClick={() => randomize()}>
        <MdOutlineAutorenew />
      </button>
    </>
  );
};

export const Play = () => {
  return (
    <PuzzleIdProvider>
      <WordsProvider>
        <BoardProvider>
          <SolutionProvider>
            <GameState>
              <Dialogs>
                <Page header={<Header buttons={<HeaderButtons />} />}>
                  <div className={classes.container}>
                    <Status />
                    <Grid />
                    <Buttons />
                    <Toast />
                  </div>
                </Page>
              </Dialogs>
            </GameState>
          </SolutionProvider>
        </BoardProvider>
      </WordsProvider>
    </PuzzleIdProvider>
  );
};
