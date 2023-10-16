import { Link } from "react-router-dom";
import classes from "./Grid.module.css";
import { useBoard } from "../BoardProvider";
import { Nest } from "./Nest";
import { useGameState } from "../GameState";

export const Grid = () => {
  const { display: boardId } = useBoard();
  const { add } = useGameState();
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
        <button className={classes.letter} onClick={() => add(t[0])}>
          {t[0]}
        </button>
        <button className={classes.letter} onClick={() => add(t[1])}>
          {t[1]}
        </button>
        <button className={classes.letter} onClick={() => add(t[2])}>
          {t[2]}
        </button>
        <div className={classes.letter} />

        <button className={classes.letter} onClick={() => add(l[0])}>
          {l[0]}
        </button>
        <Nest className={classes.filler} />
        <button className={classes.letter} onClick={() => add(r[0])}>
          {r[0]}
        </button>

        <button className={classes.letter} onClick={() => add(l[1])}>
          {l[1]}
        </button>
        <button className={classes.letter} onClick={() => add(r[1])}>
          {r[1]}
        </button>

        <button className={classes.letter} onClick={() => add(l[2])}>
          {l[2]}
        </button>
        <button className={classes.letter} onClick={() => add(r[2])}>
          {r[2]}
        </button>

        <div className={classes.letter} />
        <button className={classes.letter} onClick={() => add(b[0])}>
          {b[0]}
        </button>
        <button className={classes.letter} onClick={() => add(b[1])}>
          {b[1]}
        </button>
        <button className={classes.letter} onClick={() => add(b[2])}>
          {b[2]}
        </button>
        <div className={classes.letter} />
      </div>
      <Link to={`/${[t, r, b, l].flat().join("")}`}>Play this</Link>
    </div>
  );
};
