import { Board } from "../../types";
import classes from "./Grid.module.css";

type Props = {
  board: Board;
  input: string;
};

export const Grid = ({ board: { top, right, bottom, left }, input }: Props) => {
  const t = [...top, ..."???".split("")].slice(0, 3).sort();
  const l = [...left, ..."???".split("")].slice(0, 3).sort();
  const r = [...right, ..."???".split("")].slice(0, 3).sort();
  const b = [...bottom, ..."???".split("")].slice(0, 3).sort();

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
  console.log(`TCL ~ file: Grid.tsx:27 ~ Grid ~ coords:`, coords);

  const lines: React.ReactNode[] = [];
  if (input.length > 1) {
    const p = [];
    const pairs = new Set<string>();
    for (let i = 1; i < input.length; i += 1) {
      const a = input[i - 1];
      const b = input[i];
      const ab = `${a}${b}`;
      if (!pairs.has(ab)) {
        pairs.add(ab);
        p.push(ab);
      }
    }

    for (const ab of p) {
      const a = ab[0];
      const b = ab[1];

      const [x1, y1] = coords.get(a) ?? [0, 0];
      const [x2, y2] = coords.get(b) ?? [0, 0];
      lines.push(
        <line
          id={ab}
          key={ab}
          {...{ x1, y1, x2, y2 }}
          strokeWidth={2}
          stroke="#000a"
        />
      );
    }
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
        <svg
          className={[classes.filler, classes.nest].join(" ")}
          viewBox="0 0 60 60"
        >
          {lines}
        </svg>
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
    </div>
  );
};
