import { createPortal } from "react-dom";
import classes from "./Dialog.module.css";
import { useEffect } from "react";
import { MdOutlineClose } from "react-icons/md";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
  title: string;
};

const dialog = document.getElementById("dialog") as HTMLDialogElement | null;

export const Dialog = ({ children, onClose, title }: Props) => {
  if (!dialog) {
    throw new Error("Missing #dialog");
  }

  useEffect(() => {
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, []);

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
    <>
      <div className={classes.header}>
        <h2>{title}</h2>
        <button onClick={onClose} autoFocus>
          <MdOutlineClose />
        </button>
      </div>
      <div className={classes.content}>{children}</div>
    </>,
    dialog
  );
};
