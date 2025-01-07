import {
  MdOutlineDoneAll,
  MdLink,
  MdOutlineAutorenew,
  MdSettings,
  MdOutlineRestartAlt,
  MdInfoOutline,
} from "react-icons/md";
import { useBoard } from "../BoardProvider";
import { useGameHistory } from "../GameHistoryProvider";
import { ShareButton } from "../ShareButton";
import { useDialog } from "./context";
import classes from "./HamburgerMenu.module.css";
import { WordList } from "../WordList";
import { useGameState } from "../GameState";
import { createShareString } from "../../utils";
import { useSolution } from "../SolutionProvider";
import {
  Action,
  Content,
  HamburgerMenu as SpaHamburgerMenu,
} from "../../spa-components/HamburgerMenu";
import hamburgerClasses from "../../spa-components/HamburgerMenu/HamburgerMenu.module.css";
import { OtherApps } from "../../spa-components/HamburgerMenu/OtherApps";

export const HamburgerMenu = () => {
  const { solutions } = useGameHistory();
  const { hide, show, which } = useDialog();
  const { randomize, url } = useBoard();
  const { reset, ideas, reveal: currentReveal } = useGameState();
  const { solution } = useSolution();

  return (
    <SpaHamburgerMenu
      open={which === "hamburger"}
      onClose={() => which === "hamburger" && hide()}
      onOpen={() => show("hamburger")}
    >
      <Action
        icon={MdOutlineRestartAlt}
        text="Start på nytt"
        onClick={() => {
          reset();
          hide();
        }}
      />
      <ShareButton
        className={hamburgerClasses.action}
        text={() => url}
        CopyIcon={MdLink}
      >
        Del puslespill
      </ShareButton>
      <Content className={classes.previousSolutions}>
        {solutions.map(({ words, reveal }) => (
          <div className={classes.menuItem} key={words.join("-")}>
            <ShareButton
              text={() =>
                createShareString(
                  {
                    words,
                    ideas,
                    reveal: reveal ?? currentReveal,
                    solved: true,
                  },
                  url,
                  solution,
                )
              }
            />
            <WordList className={classes.previousSolution} path={words} />
          </div>
        ))}
      </Content>
      <Action
        icon={MdOutlineDoneAll}
        text="Vis den beste løsningen"
        onClick={() => show("solve")}
      />
      <Action
        icon={MdOutlineAutorenew}
        text="Nytt puslespill"
        onClick={() => {
          hide();
          randomize();
        }}
      />
      <Action
        icon={MdSettings}
        text="Instillinger"
        onClick={() => show("settings")}
      />
      <Action
        icon={MdInfoOutline}
        text="Om Bokstavboks"
        onClick={() => show("about")}
      />
      <OtherApps />
    </SpaHamburgerMenu>
  );
};
