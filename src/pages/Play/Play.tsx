import { Grid } from "../../components/Grid";
import { GameState, useGameState } from "../../components/GameState";
import { BoardProvider, useBoard } from "../../components/BoardProvider";
import { useState } from "react";
import { Status } from "../../components/Status";
import classes from "./Play.module.css";
import { Toast } from "../../components/Toast";
import { Buttons } from "../../components/Buttons";
import { MdOutlineDone, MdOutlineAutorenew } from "react-icons/md";
import { Dialog } from "../../components/Dialog";
import { Header } from "../../components/Header";
import { Page } from "../../components/Page";
import { PuzzleIdProvider } from "../../components/PuzzleIdProvider";
import { WordsProvider } from "../../components/WordsProvider";

const Play2 = () => {
  return (
    <div className={classes.container}>
      <Status />
      <Grid />
      <Buttons />
      <Toast />
    </div>
  );
};

export const Play = () => {
  const Buttons = () => {
    const { randomize } = useBoard();
    const { solve, complete } = useGameState();
    const [dialog, setDialog] = useState<"solve" | undefined>();

    return (
      <>
        {!complete && (
          <button onClick={() => setDialog("solve")}>
            <MdOutlineDone />
          </button>
        )}
        <button onClick={() => randomize()}>
          <MdOutlineAutorenew />
        </button>
        {dialog === "solve" && (
          <Dialog title="Vis løsning?" onClose={() => setDialog(undefined)}>
            <div>
              <p>
                Vil du se en løsning på dette puslespillet? (Det er mange mulige
                løsninger - dette er bare den korteste!)
              </p>
              <div className={classes.buttonBar}>
                <button
                  onClick={() => {
                    setDialog(undefined);
                  }}
                >
                  Nei, jeg vil fortsette å prøve
                </button>
                <button
                  className="primary"
                  onClick={() => {
                    solve();
                    setDialog(undefined);
                  }}
                >
                  Ja, takk!
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </>
    );
  };

  return (
    <PuzzleIdProvider>
      <WordsProvider>
        <BoardProvider>
          <GameState>
            <Page header={<Header buttons={<Buttons />} />}>
              <Play2 />
            </Page>
          </GameState>
        </BoardProvider>
      </WordsProvider>
    </PuzzleIdProvider>
  );
};
