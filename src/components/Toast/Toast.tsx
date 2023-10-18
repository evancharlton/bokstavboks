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
  const [showing, setShowing] = useState<ValidationError>();
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const { error, clearError } = useGameState();

  useEffect(() => {
    if (!error) {
      return;
    }

    clearError();
    clearTimeout(timerRef.current);
    setShowing(error);
    timerRef.current = setTimeout(() => {
      setShowing(undefined);
    }, 2000);
  }, [clearError, error]);

  useEffect(() => {
    return () => {
      setShowing(undefined);
      clearTimeout(timerRef.current);
    };
  }, []);

  if (!showing) {
    return null;
  }

  const string = ERRORS[showing];
  if (!string) {
    return null;
  }

  return createPortal(
    <div className={classes.toast}>{string}</div>,
    document.body
  );
};
