import { Board } from "../../../types";
import classes from "./Grid.module.css";

type Props = {
  board: Board;
};

export const Grid = ({ board: { top, right, bottom, left } }: Props) => {
  const t = [...top, ..."???".split("")].slice(0, 3).sort();
  const l = [...left, ..."???".split("")].slice(0, 3).sort();
  const r = [...right, ..."???".split("")].slice(0, 3).sort();
  const b = [...bottom, ..."???".split("")].slice(0, 3).sort();

  const id = [...t, ...r, ...b, ...l].join("");

  return (
    <div>
      {id}
      <div className={classes.box}>
        <div className={classes.letter} />
        <div className={classes.letter}>{t[0]}</div>
        <div className={classes.letter}>{t[1]}</div>
        <div className={classes.letter}>{t[2]}</div>
        <div className={classes.letter} />

        <div className={classes.letter}>{l[2]}</div>
        <div className={classes.letter} />
        <div className={classes.letter} />
        <div className={classes.letter} />
        <div className={classes.letter}>{r[0]}</div>

        <div className={classes.letter}>{l[1]}</div>
        <div className={classes.letter} />
        <div className={classes.letter} />
        <div className={classes.letter} />
        <div className={classes.letter}>{r[1]}</div>

        <div className={classes.letter}>{l[0]}</div>
        <div className={classes.letter} />
        <div className={classes.letter} />
        <div className={classes.letter} />
        <div className={classes.letter}>{r[2]}</div>

        <div className={classes.letter} />
        <div className={classes.letter}>{b[0]}</div>
        <div className={classes.letter}>{b[1]}</div>
        <div className={classes.letter}>{b[2]}</div>
        <div className={classes.letter} />
      </div>
    </div>
  );
};
