import { Fragment } from "react";
import { useGameState } from "../GameState";
import classes from "./Status.module.css";

export const Status = () => {
  const { words: path, current } = useGameState();

  return (
    <div className={classes.container}>
      <div className={classes.input}>
        {current}
        <div className={classes.caret} />
      </div>
      <div className={classes.words}>
        {path.map((word, i) => (
          <Fragment key={word}>
            {i > 0 && <div className={classes.spacer} />}
            <h3 key={word}>{word}</h3>
          </Fragment>
        ))}
      </div>
    </div>
  );
};
