import classes from "./Loader.module.css";
import "./Loader.css";

type Props = {
  text?: string;
};

export const Loader = ({ text }: Props) => (
  <div className={classes.container}>
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    {text && <span className={classes.text}>{text}</span>}
  </div>
);
