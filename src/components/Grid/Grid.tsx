import { Link } from "react-router-dom";
import classes from "./Grid.module.css";
import { useBoard } from "../BoardProvider";
import { Nest } from "./Nest";

type Props = {
  input: string;
};

export const Grid = ({ input }: Props) => {
  const { display: boardId } = useBoard();
  const t = boardId.substring(0, 3);
  const r = boardId.substring(3, 6);
  const b = boardId.substring(6, 9);
  const l = boardId.substring(9);

  const coords = new Map<string, [number, number]>();
  for (let i = 0; i < t.length; i += 1) {
    coords.set(t[i], [10 + i * 20, 2]);
  }
  for (let i = 0; i < b.length; i += 1) {
    coords.set(b[i], [10 + i * 20, 58]);
  }
  for (let i = 0; i < l.length; i += 1) {
    coords.set(l[i], [2, 10 + i * 20]);
  }
  for (let i = 0; i < r.length; i += 1) {
    coords.set(r[i], [58, 10 + i * 20]);
  }

  return (
    <div>
      <div className={classes.box}>
        <div className={classes.letter} />
        <div className={classes.letter}>{t[0]}</div>
        <div className={classes.letter}>{t[1]}</div>
        <div className={classes.letter}>{t[2]}</div>
        <div className={classes.letter} />

        <div className={classes.letter}>{l[0]}</div>
        <Nest className={classes.filler} />
        <div className={classes.letter}>{r[0]}</div>

        <div className={classes.letter}>{l[1]}</div>
        <div className={classes.letter}>{r[1]}</div>

        <div className={classes.letter}>{l[2]}</div>
        <div className={classes.letter}>{r[2]}</div>

        <div className={classes.letter} />
        <div className={classes.letter}>{b[0]}</div>
        <div className={classes.letter}>{b[1]}</div>
        <div className={classes.letter}>{b[2]}</div>
        <div className={classes.letter} />
      </div>
      <Link to={`/${[t, r, b, l].flat().join("")}`}>Play this</Link>
    </div>
  );
};
