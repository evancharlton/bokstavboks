import classes from "./Header.module.css";
import { MdHelpOutline, MdMenu } from "react-icons/md";
import { Link, useParams } from "react-router";
import { useDialog } from "../Dialogs";
import logo from "../../logo.svg";
import { UpdateButton } from "../../spa-components/PwaContainer/UpdateButton";

export const Header = () => {
  const { lang = "" } = useParams();
  const { show } = useDialog();

  return (
    <>
      <div className={classes.container}>
        <h1>
          <Link to={`/${lang}`}>
            <img src={logo} />
            Bokstavboks
          </Link>
        </h1>
        <div className={classes.buttons} style={{ gridArea: "right" }}>
          <UpdateButton />
          <button title="Hjelp med Bokstavboks" onClick={() => show("help")}>
            <MdHelpOutline />
          </button>
          {lang ? (
            <button title="Flere handlinger" onClick={() => show("hamburger")}>
              <MdMenu />
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};
