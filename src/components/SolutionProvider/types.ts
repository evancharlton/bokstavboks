export type State = {
  status: "pending" | "solving" | "solved" | "impossible";
  solution: string[];
  controller: AbortController | undefined;
  queueSize: number;
};
