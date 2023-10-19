import classes from "./Grid.module.css";
import { useBoard } from "../BoardProvider";
import { Nest } from "./Nest";
import { useGameState } from "../GameState";
import { Letter } from "../../types";
import { useEffect } from "react";

const Button = ({ letter }: { letter: Letter }) => {
  const { add, current, usedLetters, complete } = useGameState();

  return (
    <button
      disabled={complete === "revealed"}
      className={[
        classes.letter,
        usedLetters.has(letter) && classes.used,
        current.includes(letter) && classes.current,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => {
        add(letter);
      }}
    >
      {letter}
    </button>
  );
};

export const Grid = () => {
  const { complete, commit, remove, add } = useGameState();
  const { display } = useBoard();
  const t = display.substring(0, 3);
  const r = display.substring(3, 6);
  const b = display.substring(6, 9);
  const l = display.substring(9);

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
      if (complete) {
        return;
      }

      const key = e.key;
      if (key === "Enter") {
        commit();
        return;
      }

      if (key === "Backspace" || key === "Delete") {
        remove();
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
  }, [add, commit, complete, display, remove]);

  return (
    <div>
      <div className={classes.box}>
        <div className={classes.letter} />
        <Button letter={t[0] as Letter} />
        <Button letter={t[1] as Letter} />
        <Button letter={t[2] as Letter} />
        <div className={classes.letter} />

        <Button letter={l[0] as Letter} />
        <Nest className={classes.filler} />
        <Button letter={r[0] as Letter} />

        <Button letter={l[1] as Letter} />
        <Button letter={r[1] as Letter} />

        <Button letter={l[2] as Letter} />
        <Button letter={r[2] as Letter} />

        <div className={classes.letter} />
        <Button letter={b[0] as Letter} />
        <Button letter={b[1] as Letter} />
        <Button letter={b[2] as Letter} />
        <div className={classes.letter} />
      </div>
    </div>
  );
};
