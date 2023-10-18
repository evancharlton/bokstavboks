import { Link } from "react-router-dom";
import classes from "./LanguageSelect.module.css";

export const LanguageSelect = () => {
  return (
    <div className={classes.container}>
      <Link to="/nb">bokmål</Link>
      {/* <Link to="/nn">nynorsk</Link> */}
    </div>
  );
};
