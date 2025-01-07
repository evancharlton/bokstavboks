import { createPortal } from "react-dom";
import classes from "./Toast.module.css";
import { ToastType } from "../context";

type Props = {
  text: React.ReactNode;
  level: ToastType["level"];
};

export const Toast = ({ text, level }: Props) => {
  return createPortal(
    <div
      className={[
        classes.toast,
        level === "info" && classes.info,
        level === "warning" && classes.warning,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {text}
    </div>,
    document.body,
  );
};
