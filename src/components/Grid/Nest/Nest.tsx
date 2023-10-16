import { Fragment, useMemo } from "react";
import { useGameState } from "../../GameState";
import classes from "./Nest.module.css";
import { useBoard } from "../../BoardProvider";

type Props = {
  className?: string;
};

const HALF_UNIT = 50;
const UNIT = HALF_UNIT * 2;
const EDGE = HALF_UNIT * 0.2;
const SIZE = HALF_UNIT * 3 * 2;

export const Nest = ({ className }: Props) => {
  const { display } = useBoard();

  const coords = useMemo(() => {
    const t = display.substring(0, 3);
    const r = display.substring(3, 6);
    const b = display.substring(6, 9);
    const l = display.substring(9);
    const coords = new Map<string, [number, number]>();
    for (let i = 0; i < t.length; i += 1) {
      coords.set(t[i], [HALF_UNIT + i * UNIT, EDGE]);
    }
    for (let i = 0; i < b.length; i += 1) {
      coords.set(b[i], [HALF_UNIT + i * UNIT, SIZE - EDGE]);
    }
    for (let i = 0; i < l.length; i += 1) {
      coords.set(l[i], [EDGE, HALF_UNIT + i * UNIT]);
    }
    for (let i = 0; i < r.length; i += 1) {
      coords.set(r[i], [SIZE - EDGE, HALF_UNIT + i * UNIT]);
    }

    return coords;
  }, [display]);

  const { words, current } = useGameState();

  const lines = useMemo(() => {
    const input = `${words.join("")}${current}`.replace(/(.)\1+/g, "$1");

    const p = [];
    const pairs = new Set<string>();
    for (let i = 1; i < input.length; i += 1) {
      const a = input[i - 1];
      const b = input[i];
      const ab = `${a}${b}`;
      p.unshift(ab);
    }

    return p.map((ab, i) => {
      if (pairs.has(ab)) {
        return null;
      }
      pairs.add(ab);
      const [a, b] = ab;

      const [x1, y1] = coords.get(a) ?? [0, 0];
      const [x2, y2] = coords.get(b) ?? [0, 0];

      const opacity = Math.pow(Math.E, (i * -1) / 5);

      return (
        <Fragment key={ab}>
          <line
            key={ab}
            {...{ x1, y1, x2, y2 }}
            strokeWidth={4}
            stroke="#000"
            opacity={opacity}
          />
          <circle
            cx={x2}
            cy={y2}
            r={EDGE * 0.8}
            stroke="#000"
            fill="#fff"
            opacity={opacity}
          />
        </Fragment>
      );
    });
  }, [coords, current, words]);

  return (
    <svg
      className={[className, classes.nest].filter(Boolean).join(" ")}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
    >
      {lines}
    </svg>
  );
};
