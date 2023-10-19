import { ValidationError } from "./context";

export type State = {
  words: string[];
  current: string;
  error: ValidationError | undefined;
  solved: boolean;
  revealed: boolean;
};
