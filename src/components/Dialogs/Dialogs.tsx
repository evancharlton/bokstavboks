import { useCallback, useState } from "react";
import { DialogContext, DialogType, useDialog } from "./context";
import { Dialog } from "../Dialog/Dialog";
import { MdOutlineAutorenew } from "react-icons/md";
import { GameState, useGameState } from "../GameState";
import { Grid } from "../Grid";
import classes from "./Dialogs.module.css";
import { StorageSandbox } from "../../useStorage";
import { useSettings } from "../SettingsProvider";
import { WordsContext } from "../WordsProvider/context";
import { PuzzleIdContext } from "../PuzzleIdProvider/context";
import { BoardContext } from "../BoardProvider/context";
import { SolutionContext } from "../SolutionProvider/context";

type Props = {
  children: React.ReactNode;
};

const SolveDialog = () => {
  const { hide } = useDialog();
  const { solve } = useGameState();

  return (
    <Dialog title="Vis løsning?" onClose={() => hide()}>
      <div>
        <p>
          Vil du se en løsning på dette puslespillet? (Det er mange mulige
          løsninger - dette er bare den korteste!)
        </p>
        <div className={classes.buttonBar}>
          <button onClick={() => hide()}>Nei, jeg vil fortsette å prøve</button>
          <button
            className="primary"
            onClick={() => {
              solve();
              hide();
            }}
          >
            Ja, takk!
          </button>
        </div>
      </div>
    </Dialog>
  );
};

const SettingsDialog = () => {
  const { hide } = useDialog();
  const { settings, update } = useSettings();

  return (
    <Dialog
      title="Instillinger"
      onClose={() => {
        hide();
      }}
    >
      <div>
        <h3>Guidet utforskning</h3>
        <div className={classes.entry}>
          <label className={classes.switch}>
            <input
              id="hint-checkbox"
              type="checkbox"
              onChange={(e) => update({ enableHint: !!e.target.checked })}
              checked={!!settings.enableHint}
            />
            <span className={[classes.slider, classes.round].join(" ")} />
          </label>
          <label htmlFor="hint-checkbox">
            Angi merknader (<span style={{ fontSize: 10 }}>🔵</span>) på
            bokstavene for gyldige bokstavvalg.
          </label>
        </div>
      </div>
    </Dialog>
  );
};

export const Dialogs = ({ children }: Props) => {
  const [dialog, setDialog] = useState<DialogType | undefined>(undefined);

  const hide = useCallback(() => {
    setDialog(undefined);
  }, []);

  const dialogElement = (() => {
    if (!dialog) {
      return null;
    }

    switch (dialog) {
      case "help": {
        return (
          <Dialog title="Reglene" onClose={hide}>
            <p>
              Målet er å bruke alle 12 bokstavene, med så få ord som mulig.
              Bokstavene kan brukes flere ganger, men må krysse til forskjellige
              sider.
            </p>
            <hr />
            <h3>Eksemple</h3>
            <p>
              I rutenettet under er <strong>BOKSTAV</strong> startet. Du kan
              taste inn i <strong>BOKSTAVENE</strong>, men{" "}
              <strong>BOKSTAVER</strong> er umulig.
            </p>
            <StorageSandbox version="demo">
              <WordsContext.Provider
                value={{ words: ["bokstav"], dictionary: new Set() }}
              >
                <PuzzleIdContext.Provider
                  value={{
                    puzzleId: "bkaotnsvmepr",
                    puzzleHash: 0,
                    random: () => 0,
                  }}
                >
                  <BoardContext.Provider
                    value={{
                      id: "bkaotnsvmepr",
                      display: "bkaotnsvmepr",
                      shuffle: () => undefined,
                      randomize: () => undefined,
                      url: "",
                    }}
                  >
                    <SolutionContext.Provider
                      value={{
                        solve: () => undefined,
                        abort: () => undefined,
                        solution: [],
                        status: "pending",
                        queueSize: 0,
                      }}
                    >
                      <GameState words={[]} current="bokstav">
                        <Grid />
                      </GameState>
                    </SolutionContext.Provider>
                  </BoardContext.Provider>
                </PuzzleIdContext.Provider>
              </WordsContext.Provider>
            </StorageSandbox>
            <p>Lykke til!</p>
            <hr />
            <p>
              Du kan spille så mange oppgaver du vil, og så lenge du vil. Klikk
              på{" "}
              <span
                style={{
                  border: "1px solid black",
                  borderRadius: 4,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <MdOutlineAutorenew />
              </span>{" "}
              knappene for å generere et nytt puslespill!
            </p>
          </Dialog>
        );
      }

      case "about": {
        return (
          <Dialog title="Om Bokstavboks" onClose={hide}>
            <p>
              Bokstavboks var inspirert av{" "}
              <a
                target="_blank"
                href="https://www.nytimes.com/puzzles/letter-boxed"
                rel="nofollow noopener noreferrer"
              >
                NYT Letter Boxed
              </a>
              . Den ble laget som et gratis-å-leke pedagogisk verktøy for å
              hjelpe til med å lære norsk.
            </p>
            <p>
              Den bruker ordbanker fra{" "}
              <a
                target="_blank"
                href="https://nb.no"
                rel="nofollow noopener noreferrer"
              >
                Nasjonalbiblioteket
              </a>{" "}
              under{" "}
              <a
                target="_blank"
                href="https://creativecommons.org/licenses/by/4.0/"
                rel="nofollow noopener noreferrer"
              >
                CC-BY-lisensen
              </a>
              .
            </p>
            <p>
              Bokstavboks er{" "}
              <a
                target="_blank"
                href="https://github.com/evancharlton/bokstavboks"
                rel="noreferrer"
              >
                åpen kildekode-programvare
              </a>
              , utgitt under MIT-lisensen. Bidrager er velkomme!
            </p>
            <hr />
            <p>Hvis du liker dette, prøv:</p>
            <ul>
              <li>
                <a
                  target="_blank"
                  href="https://evancharlton.github.io/ordle"
                  rel="noreferrer"
                >
                  Ordle: Wordle på norsk
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://stavehumle.no/"
                  rel="noreferrer"
                >
                  Stavehumle
                </a>
              </li>
            </ul>
            <hr />
            <p>
              Spørsmål?{" "}
              <a
                target="_blank"
                href="mailto:evancharlton@gmail.com"
                rel="noreferrer"
              >
                evancharlton@gmail.com
              </a>
            </p>
          </Dialog>
        );
      }

      case "solve": {
        return <SolveDialog />;
      }

      case "settings": {
        return <SettingsDialog />;
      }

      default: {
        return (
          <Dialog title={dialog.title} onClose={() => setDialog(undefined)}>
            {dialog.content}
          </Dialog>
        );
      }
    }
  })();

  return (
    <DialogContext.Provider value={{ show: setDialog, hide }}>
      {children}
      {dialogElement}
    </DialogContext.Provider>
  );
};
