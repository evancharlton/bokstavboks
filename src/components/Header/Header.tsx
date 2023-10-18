import { useState } from "react";
import classes from "./Header.module.css";
import { Dialog } from "../Dialog";
import { MdHelpOutline, MdOutlineAutorenew } from "react-icons/md";
import { Link, useParams } from "react-router-dom";

type Props = {
  buttons?: React.ReactNode[] | React.ReactNode;
};

export const Header = ({ buttons }: Props) => {
  const { lang } = useParams();
  const [dialog, setDialog] = useState<"help" | "settings" | undefined>();

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
          <Link to={`/${lang}`}>Bokstav boks</Link>
        </h1>
        <div className={classes.buttons} style={{ gridArea: "right" }}>
          {buttons}
          <button onClick={() => setDialog("help")}>
            <MdHelpOutline />
          </button>
        </div>
      </div>
      {dialog === "help" && (
        <Dialog title="Hjelp" onClose={() => setDialog(undefined)}>
          <p>
            <strong>Bokstav Boks</strong> er et spill med norske ord. Fullfør
            puslespillet ved å lage ord som bruker alle 12 bokstavene. Det er
            lov å bruke bokstaver flere ganger! Hver bokstav må imidlertid være
            på en annen side enn den forrige bokstaven.
          </p>
          <p>Lykke til!</p>
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
          <hr />
          <p>
            (Want to play this in English? Try{" "}
            <a
              href="https://www.nytimes.com/puzzles/letter-boxed"
              rel="nofollow noopener noreferrer"
            >
              NYT Letter Boxed
            </a>
            !)
          </p>
        </Dialog>
      )}
      {dialog === "settings" && (
        <Dialog title="Instillinger" onClose={() => setDialog(undefined)}>
          <p>TODO: Add this when I have settings to control</p>
        </Dialog>
      )}
    </>
  );
};
