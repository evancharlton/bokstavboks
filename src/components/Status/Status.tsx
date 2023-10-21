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
import { TbExternalLink } from "react-icons/tb";
import { useNavigate, useParams } from "react-router";
import { useBoard } from "../BoardProvider";
import { useDialog } from "../Dialogs";

const WordList = ({ path }: { path: string[] }) => {
  return (
    <div className={classes.words}>
      {path.map((word, i) => (
        <Fragment key={word}>
          {i > 0 && <div className={classes.spacer} />}
          <h3 key={word} className={classes.word}>
            <a
              href={`https://naob.no/s%C3%B8k/${word}`}
              target="_blank"
              rel="noreferrer"
            >
              {word}
              <TbExternalLink />
            </a>
          </h3>
        </Fragment>
      ))}
    </div>
  );
};

const EMOJI = {
  revealed: "💥",
  solved: "🎉",
  none: "",
} as const;

const ShareButton = ({ children }: { children?: React.ReactNode }) => {
  const { solution, url } = useBoard();
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
  const [canShare, setCanShare] = useState(!!navigator.canShare?.({ text }));

  const onShare = useCallback(() => {
    if (!solved && !revealed) {
      return;
    }

    if (canShare) {
      navigator
        .share({ text })
        .catch(() => {
          navigator.clipboard.writeText(text);
        })
        .catch((_) => {
          setCanShare(false);
        });
    } else if (navigator.clipboard && !!navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
  }, [solved, revealed, canShare, text]);

  return (
    <button onClick={onShare}>
      {canShare ? <MdOutlineShare /> : <MdOutlineContentCopy />}
      {children}
    </button>
  );
};

export const Status = () => {
  const { solution } = useBoard();
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
            <WordList path={solution} />
            <p>
              Hvert puslespill har <strong>mange</strong> forskjellige
              løsninger. Du løste det med <strong>{words.length} ord</strong>,
              som er flott!
            </p>
            <div className={classes.buttons}>
              <ShareButton>Del</ShareButton>
              <button onClick={() => undefined}>
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
            <WordList path={solution} />
            <div className={classes.buttons}>
              <ShareButton>Del</ShareButton>
              <button onClick={() => undefined}>
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
              <ShareButton>Del</ShareButton>
              <button onClick={hide}>
                <MdOutlineRestartAlt />
                Fortsett å spille
              </button>
              <button onClick={() => show("solve")}>
                <MdOutlineDone />
                Vis løsningen
              </button>
              <button onClick={() => undefined}>
                <MdOutlineAutorenew /> Prøv på nytt
              </button>
            </div>
          </>
        ),
      });
    }
  }, [solved, revealed, showDialog, solution, words.length, hide, show]);

  return (
    <div className={classes.container}>
      {(solved || revealed) && (
        <div className={classes.complete}>
          <h1>{emoji}</h1>
          <ShareButton />
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
      {revealed && <WordList path={solution} />}
      <WordList path={words} />
    </div>
  );
};
