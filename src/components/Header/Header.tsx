import { useState } from "react";
import classes from "./Header.module.css";
import { Dialog } from "../Dialog";
import { MdHelpOutline, MdOutlineSettings } from "react-icons/md";
import { Link } from "react-router-dom";

export const Header = () => {
  const [dialog, setDialog] = useState<"help" | "settings" | undefined>();

  return (
    <>
      <div className={classes.container}>
        <div
          className={classes.buttons}
          style={{ justifyContent: "flex-start" }}
        >
          <Link className={classes.button} to="/">
            🇳🇴
          </Link>
        </div>
        <h1>Bokstavene Eske</h1>
        <div className={classes.buttons}>
          <button onClick={() => setDialog("help")}>
            <MdHelpOutline />
          </button>
          <button onClick={() => setDialog("settings")}>
            <MdOutlineSettings />
          </button>
        </div>
      </div>
      {dialog === "help" && (
        <Dialog title="Hjelp" onClose={() => setDialog(undefined)}>
          <p>Help text here</p>
        </Dialog>
      )}
    </>
  );
};
