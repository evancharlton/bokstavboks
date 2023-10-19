import { Fragment, useMemo } from "react";
import { useGameState } from "../GameState";
import classes from "./Status.module.css";
import {
  MdOutlineAutorenew,
  MdOutlineContentCopy,
  MdOutlineShare,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useBoard } from "../BoardProvider";

const WordList = ({ path }: { path: string[] }) => {
  return (
    <div className={classes.words}>
      {path.map((word, i) => (
        <Fragment key={word}>
          {i > 0 && <div className={classes.spacer} />}
          <h3 key={word}>{word}</h3>
        </Fragment>
      ))}
    </div>
  );
};

const EMOJI = {
  revealed: "💥",
  solved: "🎉",
} as const;

export const Status = () => {
  const { id, solution } = useBoard();
  const { words, current, complete } = useGameState();
  const navigate = useNavigate();
  const { lang } = useParams();

  const [mode, share] = useMemo(() => {
    const header =
      complete === "solved"
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

    const text = complete
      ? [
          header,
          `⚪${x[0]}${x[1]}${x[2]}⚪`,
          `${x[11]}⚪⚪⚪${x[3]}`,
          `${x[10]}⚪${EMOJI[complete]}⚪${x[4]}`,
          `${x[9]}⚪⚪⚪${x[5]}`,
          `⚪${x[8]}${x[7]}${x[6]}⚪`,
          ``,
          url,
        ].join("\n")
      : "";

    const canShare = navigator.canShare?.({ text });

    const share = () => {
      if (!complete) {
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
  }, [complete, id, lang, words]);

  return (
    <div className={classes.container}>
      {complete && (
        <div className={classes.complete}>
          <h1>{EMOJI[complete]}</h1>
          <button onClick={() => share()}>
            {mode === "share" ? <MdOutlineShare /> : <MdOutlineContentCopy />}
          </button>
          <button onClick={() => navigate(`/${lang}/${Date.now()}`)}>
            <MdOutlineAutorenew />
          </button>
        </div>
      )}
      {!complete && (
        <div className={classes.input}>
          {current}
          <div className={classes.caret} />
        </div>
      )}
      {complete === "revealed" && <WordList path={solution} />}
      <WordList path={words} />
    </div>
  );
};
