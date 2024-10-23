import classes from "./Header.module.css";
import { MdHelpOutline, MdMenu } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useDialog } from "../Dialogs";

export const Header = () => {
  const { lang = "" } = useParams();
  const { show } = useDialog();

  return (
    <>
      <div className={classes.container}>
        <h1>
          <Link to={`/${lang}`}>Bokstavboks</Link>
        </h1>
        <div className={classes.buttons} style={{ gridArea: "right" }}>
          <button onClick={() => show("help")}>
            <MdHelpOutline />
          </button>
          <button onClick={() => show("hamburger")}>
            <MdMenu />
          </button>
        </div>
      </div>
    </>
  );
};
