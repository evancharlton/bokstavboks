import { Fragment } from "react";
import classes from "./WordList.module.css";
import { TbExternalLink } from "react-icons/tb";

export const WordList = ({ path }: { path: string[] }) => {
  return (
    <div className={classes.words}>
      {path.map((word, i) => (
        <Fragment key={word}>
          <h3 key={word} className={classes.word}>
            {i > 0 && <div className={classes.spacer} />}
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
