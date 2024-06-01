import { Fragment } from "react";
import classes from "./WordList.module.css";
import { TbExternalLink } from "react-icons/tb";
import { isLetters } from "../../types";

export const WordList = ({ path }: { path: string[] }) => {
  return (
    <div className={classes.words}>
      {path.map((word, i) => (
        <Fragment key={[word, i].join("/")}>
          <h3 className={classes.word}>
            {i > 0 && <div className={classes.spacer} />}
            {isLetters(word) ? (
              <a
                href={`https://naob.no/søk?q=${word}`}
                target="_blank"
                rel="noreferrer"
              >
                {word}
                <TbExternalLink />
              </a>
            ) : (
              word
            )}
          </h3>
        </Fragment>
      ))}
    </div>
  );
};
