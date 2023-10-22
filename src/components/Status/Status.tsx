import { Fragment, useCallback, useEffect, useState } from "react";
import { useGameState } from "../GameState";
import classes from "./Status.module.css";
import {
  MdOutlineAutorenew,
  MdOutlineContentCopy,
  MdOutlineDone,
  MdOutlineRestartAlt,
  MdOutlineShare,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useBoard } from "../BoardProvider";
import { useDialog } from "../Dialogs";
import { useSolution } from "../SolutionProvider";
import { Solution } from "../Solution";
import { WordList } from "../WordList";
import { ShareButton } from "../ShareButton";

const EMOJI = {
  revealed: "💥",
  solved: "🎉",
  none: "",
} as const;

const LocalShareButton = ({ children }: { children?: React.ReactNode }) => {
  const { url } = useBoard();
  const { solution } = useSolution();
  const { words, solved, revealed } = useGameState();

  const header = (() => {
    if (revealed && solved) {
      return `Løste ${solution.length}-ordsoppgave med ${words.length} ord!`;
    } else if (revealed) {
      return `Sitter fast på ${words.length} ord.`;
    } else {
      return `Løst med ${words.length} ord!`;
    }
  })();

  const emoji = EMOJI[solved ? "solved" : revealed ? "revealed" : "none"];

  const foundLetters = new Set(words.join("")).size;
  const x = new Array(12).fill("⚫");
  for (let i = 0; i < foundLetters; i += 1) {
    x[i] = "🟢";
  }

  const text =
    revealed || solved
      ? [
          header,
          `▫️${x[0]}${x[1]}${x[2]}▫️`,
          `${x[11]}▫️▫️▫️${x[3]}`,
          `${x[10]}▫️${emoji}▫️${x[4]}`,
          `${x[9]}▫️▫️▫️${x[5]}`,
          `▫️${x[8]}${x[7]}${x[6]}▫️`,
          ``,
          url,
        ].join("\n")
      : "";

  return <ShareButton text={() => text}>{children}</ShareButton>;
};

export const Status = () => {
  const { randomize } = useBoard();
  const { words, current, solved, revealed } = useGameState();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { show, hide } = useDialog();

  const emoji = EMOJI[solved ? "solved" : revealed ? "revealed" : "none"];

  const { show: showDialog } = useDialog();

  useEffect(() => {
    if (revealed && solved) {
      showDialog({
        title: `🤖 Løsningen`,
        content: (
          <>
            <p>
              Løsningen med <strong>færrest ord</strong> for dette puslespillet
              er:
            </p>
            <Solution />
            <p>
              Hvert puslespill har <strong>mange</strong> forskjellige
              løsninger. Du løste det med <strong>{words.length} ord</strong>,
              som er flott!
            </p>
            <div className={classes.buttons}>
              <LocalShareButton>Del</LocalShareButton>
              <button onClick={randomize}>
                <MdOutlineAutorenew /> Prøv på nytt
              </button>
            </div>
          </>
        ),
      });
    } else if (revealed) {
      showDialog({
        title: `💥 Løsningen`,
        content: (
          <>
            <p>
              Løsningen med <strong>færrest ord</strong> for dette puslespillet
              er:
            </p>
            <Solution />
            <div className={classes.buttons}>
              <LocalShareButton>Del</LocalShareButton>
              <button onClick={randomize}>
                <MdOutlineAutorenew /> Prøv på nytt
              </button>
            </div>
          </>
        ),
      });
    } else if (solved) {
      showDialog({
        title: "🎉 Bra jobb!",
        content: (
          <>
            <p>
              Du løste dette puslespillet med{" "}
              <strong>{words.length} ord</strong>. Imidlertid kan en kortere
              løsning være mulig!
            </p>
            <div className={classes.buttons}>
              <LocalShareButton>Del</LocalShareButton>
              <button onClick={hide}>
                <MdOutlineRestartAlt />
                Fortsett å spille
              </button>
              <button onClick={() => show("solve")}>
                <MdOutlineDone />
                Vis løsningen
              </button>
              <button onClick={randomize}>
                <MdOutlineAutorenew /> Prøv på nytt
              </button>
            </div>
          </>
        ),
      });
    }
  }, [hide, randomize, revealed, show, showDialog, solved, words.length]);

  return (
    <div className={classes.container}>
      {(solved || revealed) && (
        <div className={classes.complete}>
          <h1>{emoji}</h1>
          <LocalShareButton />
          <button disabled={revealed} onClick={() => show("solve")}>
            <MdOutlineDone />
          </button>
          <button onClick={() => navigate(`/${lang}/${Date.now()}`)}>
            <MdOutlineAutorenew />
          </button>
        </div>
      )}
      {!(revealed || solved) && (
        <div className={classes.input}>
          {current}
          <div className={classes.caret} />
        </div>
      )}
      <Solution />
      <WordList path={words} />
    </div>
  );
};
