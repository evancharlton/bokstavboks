import { createPortal } from "react-dom";
import classes from "./Dialog.module.css";
import { useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

export const Dialog = ({ children, onClose, title }: Props) => {
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("keydown", keydown);
    };
  }, [onClose]);

  return createPortal(
    <div className={classes.backdrop}>
      <div className={classes.dialog}>
        <div className={classes.header}>
          <h2>{title}</h2>
          <button onClick={onClose}>
            <MdOutlineClose />
          </button>
        </div>
        <div className={classes.content}>{children}</div>
      </div>
    </div>,
    document.getElementById("root") ?? document.body
  );
};
