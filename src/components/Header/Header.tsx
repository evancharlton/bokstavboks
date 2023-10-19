import { useState } from "react";
import classes from "./Header.module.css";
import { Dialog } from "../Dialog";
import {
  MdHelpOutline,
  MdOutlineAutorenew,
  MdOutlineInfo,
} from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { GameState } from "../GameState";
import { Grid } from "../Grid";
import { BoardProvider } from "../BoardProvider";
import { PuzzleIdProvider } from "../PuzzleIdProvider";

type Props = {
  buttons?: React.ReactNode[] | React.ReactNode;
};

export const Header = ({ buttons }: Props) => {
  const { lang } = useParams();
  const [dialog, setDialog] = useState<
    "help" | "settings" | "about" | undefined
  >();

  return (
    <>
      <div className={classes.container}>
        <div
          className={classes.buttons}
          style={{ justifyContent: "flex-start", gridArea: "left" }}
        >
          <Link className={classes.button} to="/">
            🇳🇴
          </Link>
        </div>
        <h1>
          <Link to={`/${lang}`}>Bokstavboks</Link>
        </h1>
        <div className={classes.buttons} style={{ gridArea: "right" }}>
          {buttons}
          <button onClick={() => setDialog("help")}>
            <MdHelpOutline />
          </button>
          <button onClick={() => setDialog("about")}>
            <MdOutlineInfo />
          </button>
        </div>
      </div>
      {dialog === "help" && (
        <Dialog title="Reglene" onClose={() => setDialog(undefined)}>
          <p>
            Målet er å bruke alle 12 bokstavene, med så få ord som mulig.
            Bokstavene kan brukes flere ganger, men må krysse til forskjellige
            sider.
          </p>
          <hr />
          <h3>Eksemple</h3>
          <p>
            I rutenettet under er <strong>BOKSTAV</strong> startet. Du kan gå
            inn i <strong>BOKSTAVENE</strong>, men <strong>BOKSTAVER</strong> er
            umulig.
          </p>
          <PuzzleIdProvider puzzleId="bkaotnsvmepr">
            <BoardProvider solution={["bokstav"]}>
              <GameState words={[]} current="bokstav">
                <Grid />
              </GameState>
            </BoardProvider>
          </PuzzleIdProvider>
          <p>Lykke til!</p>
          <hr />
          <p>
            Du kan spille så mange oppgaver du vil, og så lenge du vil. Klikk på{" "}
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
      )}
      {dialog === "settings" && (
        <Dialog title="Instillinger" onClose={() => setDialog(undefined)}>
          <p>TODO: Add this when I have settings to control</p>
        </Dialog>
      )}
      {dialog === "about" && (
        <Dialog title="Om Bokstavboks" onClose={() => setDialog(undefined)}>
          <p>
            Bokstavboks var inspirert av{" "}
            <a
              target="_blank"
              href="https://www.nytimes.com/puzzles/letter-boxed"
              rel="nofollow noopener noreferrer"
            >
              NYT Letter Boxed
            </a>
            . Den ble laget som et gratis-å-leke pedagogisk verktøy for å hjelpe
            til med å lære norsk.
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
                href="https://evancharlton.github.io/stavehumle"
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
      )}
    </>
  );
};
