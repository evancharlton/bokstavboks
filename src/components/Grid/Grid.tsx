import classes from "./Grid.module.css";
import { useBoard } from "../BoardProvider";
import { Nest } from "./Nest";
import { useGameState } from "../GameState";
import { Letter, isLetters } from "../../types";
import { useEffect } from "react";
import { useWords } from "../WordsProvider";
import { useSettings } from "../SettingsProvider";

const Button = ({
  letter,
  a,
  b,
  className,
}: {
  letter: Letter;
  a: Letter;
  b: Letter;
  className: string;
}) => {
  const { frozen, add, remove, current, usedLetters, reveal } = useGameState();
  const { words } = useWords();
  const { settings } = useSettings();

  const lastLetter = current[current.length - 1];
  const prefix = `${current}${letter}`;

  return (
    <div
      className={[
        classes.letterContainer,
        className,
        (lastLetter === a || lastLetter === b) && classes.peer,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        disabled={frozen || reveal === "full"}
        className={[
          classes.letter,
          usedLetters.has(letter) && classes.used,
          current.includes(letter) && classes.current,
          letter === lastLetter && classes.mostRecent,
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => {
          if (letter === lastLetter) {
            remove();
          } else {
            add(letter);
          }
        }}
      >
        {letter}
      </button>
      {settings.enableHint && (
        <div
          className={[
            current.length > 0 &&
              words.find((word) => word.startsWith(prefix)) &&
              classes.active,
            classes.dot,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          🔵
        </div>
      )}
    </div>
  );
};

const CLASSES = [
  classes.idTop,
  classes.idRight,
  classes.idBottom,
  classes.idLeft,
] as const;

export const Grid = () => {
  const {
    solved,
    reveal,
    hints: { colors },
    commit,
    remove,
    add,
  } = useGameState();
  const { display, groups } = useBoard();
  const t = display.substring(0, 3);
  const r = display.substring(3, 6);
  const b = display.substring(6, 9);
  const l = display.substring(9);

  if (!isLetters(t) || !isLetters(r) || !isLetters(b) || !isLetters(l)) {
    throw new Error("bad data");
  }

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      const key = e.key;
      if (reveal === "full") {
        return;
      }

      if (key === "Backspace" || key === "Delete") {
        remove();
        return;
      }

      if (solved) {
        return;
      }

      if (key === "Enter") {
        commit();
        return;
      }

      if (key.length !== 1) {
        return;
      }

      if (!display.includes(key)) {
        return;
      }

      add(key);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [add, commit, reveal, solved, display, remove]);

  const topClass = CLASSES[groups[0]];
  const rightClass = CLASSES[groups[1]];
  const bottomClass = CLASSES[groups[2]];
  const leftClass = CLASSES[groups[3]];

  return (
    <div className={colors ? classes.colors : undefined}>
      <div className={classes.box}>
        <div className={classes.letter} />
        <Button
          className={[classes.top, topClass].join(" ")}
          letter={t[0]}
          a={t[1]}
          b={t[2]}
        />
        <Button
          className={[classes.top, topClass].join(" ")}
          letter={t[1]}
          a={t[0]}
          b={t[2]}
        />
        <Button
          className={[classes.top, topClass].join(" ")}
          letter={t[2]}
          a={t[0]}
          b={t[1]}
        />
        <div className={classes.letter} />

        <Button
          className={[classes.left, leftClass].join(" ")}
          letter={l[0]}
          a={l[1]}
          b={l[2]}
        />
        <Nest className={classes.filler} />
        <Button
          className={[classes.right, rightClass].join(" ")}
          letter={r[0]}
          a={r[1]}
          b={r[2]}
        />

        <Button
          className={[classes.left, leftClass].join(" ")}
          letter={l[1]}
          a={l[0]}
          b={l[2]}
        />
        <Button
          className={[classes.right, rightClass].join(" ")}
          letter={r[1]}
          a={r[0]}
          b={r[2]}
        />

        <Button
          className={[classes.left, leftClass].join(" ")}
          letter={l[2]}
          a={l[0]}
          b={l[1]}
        />
        <Button
          className={[classes.right, rightClass].join(" ")}
          letter={r[2]}
          a={r[0]}
          b={r[1]}
        />

        <div className={classes.letter} />
        <Button
          className={[classes.bottom, bottomClass].join(" ")}
          letter={b[0]}
          a={b[1]}
          b={b[2]}
        />
        <Button
          className={[classes.bottom, bottomClass].join(" ")}
          letter={b[1]}
          a={b[0]}
          b={b[2]}
        />
        <Button
          className={[classes.bottom, bottomClass].join(" ")}
          letter={b[2]}
          a={b[0]}
          b={b[1]}
        />
        <div className={classes.letter} />
      </div>
    </div>
  );
};
