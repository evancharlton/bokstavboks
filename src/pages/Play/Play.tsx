import { Grid } from "../../components/Grid";
import { GameState, useGameState } from "../../components/GameState";
import { BoardProvider, useBoard } from "../../components/BoardProvider";
import { Status } from "../../components/Status";
import classes from "./Play.module.css";
import { Buttons } from "../../components/Buttons";
import {
  MdOutlineDone,
  MdOutlineAutorenew,
  MdLink,
  MdSettings,
} from "react-icons/md";
import { Header } from "../../components/Header";
import { Page } from "../../components/Page";
import { PuzzleIdProvider } from "../../components/PuzzleIdProvider";
import { WordsProvider } from "../../components/WordsProvider";
import { Dialogs, useDialog } from "../../components/Dialogs";
import { SolutionProvider } from "../../components/SolutionProvider";
import { ShareButton } from "../../components/ShareButton";

const HeaderButtons = () => {
  const { randomize } = useBoard();
  const { reveal } = useGameState();
  const { show } = useDialog();

  return (
    <>
      {reveal !== "full" && (
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

const ShareUrl = () => {
  const { url } = useBoard();

  return <ShareButton text={() => url} CopyIcon={MdLink} />;
};

const SettingsButton = () => {
  const { show } = useDialog();
  return (
    <button onClick={() => show("settings")}>
      <MdSettings />
    </button>
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
                <Page
                  header={
                    <Header
                      leftButtons={[
                        <ShareUrl key="share" />,
                        <SettingsButton key="settings" />,
                      ]}
                      buttons={<HeaderButtons />}
                    />
                  }
                >
                  <div className={classes.container}>
                    <Status />
                    <Grid />
                    <Buttons />
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
