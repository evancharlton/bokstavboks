import classes from "./Header.module.css";
import { MdHelpOutline, MdLink, MdOutlineInfo } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useDialog } from "../Dialogs";
import { ShareButton } from "../ShareButton";

type Props = {
  buttons?: React.ReactNode[] | React.ReactNode;
  leftButtons?: React.ReactNode[] | React.ReactNode;
};

export const Header = ({ buttons, leftButtons }: Props) => {
  const { lang } = useParams();
  const { show } = useDialog();

  return (
    <>
      <div className={classes.container}>
        <div
          className={classes.buttons}
          style={{ justifyContent: "flex-start", gridArea: "left" }}
        >
          <Link className={classes.button} to="/">
            🇳🇴
          </Link>
          {leftButtons}
        </div>
        <h1>
          <Link to={`/${lang}`}>Bokstavboks</Link>
        </h1>
        <div className={classes.buttons} style={{ gridArea: "right" }}>
          {buttons}
          <button onClick={() => show("help")}>
            <MdHelpOutline />
          </button>
          <button onClick={() => show("about")}>
            <MdOutlineInfo />
          </button>
        </div>
      </div>
    </>
  );
};
