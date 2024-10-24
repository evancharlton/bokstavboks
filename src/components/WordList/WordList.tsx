import { Fragment } from "react";
import classes from "./WordList.module.css";
import { TbExternalLink } from "react-icons/tb";
import { isLetters } from "../../types";
import { useGameState } from "../GameState";
import { MdLightbulbOutline } from "react-icons/md";

type Props = {
  path: string[];
  className?: string;
  element?: (_: {
    className: string;
    children: React.ReactNode;
  }) => React.ReactElement;
};

const H3: NonNullable<Props["element"]> = (props) => <h3 {...props} />;

export const WordList = ({ path, element: Element = H3, className }: Props) => {
  const { ideas } = useGameState();
  return (
    <div className={[classes.words, className].filter(Boolean).join(" ")}>
      {path.map((word, i) => (
        <Fragment key={[word, i].join("/")}>
          <Element className={classes.word}>
            {i > 0 && <div className={classes.spacer} />}
            {isLetters(word) ? (
              <a
                href={`https://naob.no/søk?q=${word}`}
                target="_blank"
                rel="noreferrer"
              >
                {ideas[word] ? <MdLightbulbOutline /> : null}
                {word}
                <TbExternalLink />
              </a>
            ) : (
              word
            )}
          </Element>
        </Fragment>
      ))}
    </div>
  );
};
