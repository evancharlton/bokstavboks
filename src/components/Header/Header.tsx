import classes from "./Header.module.css";
import { MdHelpOutline, MdMenu, MdOutlineRefresh } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useDialog } from "../Dialogs";
import { usePwa } from "../PwaContainer";

export const Header = () => {
  const { lang = "" } = useParams();
  const { show } = useDialog();
  const { updateNeeded, performUpdate } = usePwa();

  return (
    <>
      <div className={classes.container}>
        <h1>
          <Link to={`/${lang}`}>
            <img src="/logo.svg" />
            Bokstavboks
          </Link>
        </h1>
        <div className={classes.buttons} style={{ gridArea: "right" }}>
          {updateNeeded ? (
            <button
              title="oppdater appen"
              onClick={() => performUpdate()}
              className={classes.refresh}
            >
              <MdOutlineRefresh />
            </button>
          ) : null}
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
