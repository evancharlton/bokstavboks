import { Fragment, useMemo } from "react";
import { useGameState } from "../GameState";
import classes from "./Status.module.css";
import {
  MdOutlineAutorenew,
  MdOutlineContentCopy,
  MdOutlineDone,
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

export const Status = () => {
  const { id, solution } = useBoard();
  const { words, current, solved, revealed } = useGameState();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { show } = useDialog();

  const emoji = EMOJI[solved ? "solved" : revealed ? "revealed" : "none"];

  const [mode, share] = useMemo(() => {
    const header = solved
      ? `Løst med ${words.length} ord!`
      : `Sitter fast på ${words.length} ord`;

    const url = `${window.location.protocol}//${
      window.location.host
    }/${window.location.pathname.replace(/^\//, "")}#/${lang}/${id}`;

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

    const canShare = navigator.canShare?.({ text });

    const share = () => {
      if (!solved && !revealed) {
        return;
      }

      if (canShare) {
        navigator.share({ text }).catch(() => {
          navigator.clipboard.writeText(text);
        });
      } else if (navigator.clipboard && !!navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    };

    return [canShare ? "share" : "copy", share];
  }, [solved, words, lang, id, emoji, revealed]);

  return (
    <div className={classes.container}>
      {(solved || revealed) && (
        <div className={classes.complete}>
          <h1>{emoji}</h1>
          <button onClick={() => share()}>
            {mode === "share" ? <MdOutlineShare /> : <MdOutlineContentCopy />}
          </button>
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
