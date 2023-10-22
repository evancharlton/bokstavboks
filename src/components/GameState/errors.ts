import { ValidationError } from "./context";

export const ERRORS: Record<ValidationError, string> = {
  "append-illegal-letter": "",
  "contains-invalid-letters": "",
  "append-invalid-letter": "",
  "illegal-start-letter": "",
  "no-input": "",
  "unknown-word": "ukjent ord",
  "duplicate-word": "ordet er allerede brukt",
} as const;
