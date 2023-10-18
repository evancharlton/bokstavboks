import { ValidationError } from "./context";

export type State = {
  words: string[];
  current: string;
  error: ValidationError | undefined;
  complete: "revealed" | "solved" | undefined;
};
