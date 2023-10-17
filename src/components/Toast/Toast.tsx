import { useEffect, useRef, useState } from "react";
import { useGameState } from "../GameState";
import { createPortal } from "react-dom";
import classes from "./Toast.module.css";
import { ValidationError } from "../GameState/context";

const ERRORS: Record<ValidationError, string> = {
  "append-illegal-letter": "",
  "contains-invalid-letters": "",
  "append-invalid-letter": "",
  "illegal-start-letter": "",
  "no-input": "",
  "unknown-word": "ukjent ord",
  "duplicate-word": "ordet er allerede brukt",
};

export const Toast = () => {
  const [showing, setShowing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { error } = useGameState();

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!error) {
      return;
    }

    setShowing(true);
    timerRef.current = setTimeout(() => {
      setShowing(false);
    }, 2000);
  }, [error]);

  useEffect(() => {
    return () => {
      setShowing(false);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!error || !showing) {
    return null;
  }

  const string = ERRORS[error];
  if (!string) {
    return null;
  }

  return createPortal(
    <div className={classes.toast}>{string}</div>,
    document.body
  );
};
