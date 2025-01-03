import { Grid } from "../../components/Grid";
import { GameState } from "../../components/GameState";
import { BoardProvider } from "../../components/BoardProvider";
import { Status } from "../../components/Status";
import classes from "./Play.module.css";
import { Buttons } from "../../components/Buttons";
import { PuzzleIdProvider } from "../../components/PuzzleIdProvider";
import { Dialogs, useDialog } from "../../components/Dialogs";
import { SolutionProvider } from "../../components/SolutionProvider";
import { GameHistoryProvider } from "../../components/GameHistoryProvider";
import { MdMenu } from "react-icons/md";
import { ButtonsPortal } from "../../spa-components/Header";

const Hamburger = () => {
  const { show } = useDialog();
  return (
    <ButtonsPortal>
      <button title="Flere handlinger" onClick={() => show("hamburger")}>
        <MdMenu />
      </button>
    </ButtonsPortal>
  );
};

export const Play = () => {
  return (
    <PuzzleIdProvider>
      <BoardProvider>
        <SolutionProvider>
          <GameHistoryProvider>
            <GameState>
              <Dialogs>
                <Hamburger />
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
