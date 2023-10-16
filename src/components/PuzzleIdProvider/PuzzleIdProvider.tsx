import { useMemo } from "react";
import { PuzzleIdContext } from "./context";
import { useParams } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const todayId = () => {
  const today = new Date();
  return [
    today.getFullYear(),
    `0${today.getMonth() + 1}`.substr(-2),
    `0${today.getDate()}`.substr(-2),
  ].join("-");
};

const mulberry32 = (seed: number) => {
  return (): number => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const javaHashCode = (input: string): number => {
  const length = input.length;
  if (length === 0) {
    return 0;
  }

  let hash = 0;
  for (let i = 0; i < length; i += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
  }
  return hash;
};

export const PuzzleIdProvider = ({ children }: Props) => {
  const { puzzleId = todayId() } = useParams();
  const puzzleHash = useMemo(() => javaHashCode(puzzleId), [puzzleId]);
  const random = useMemo(() => mulberry32(puzzleHash), [puzzleHash]);

  return (
    <PuzzleIdContext.Provider value={{ random, puzzleId, puzzleHash }}>
      {children}
    </PuzzleIdContext.Provider>
  );
};
