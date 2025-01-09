import { PuzzleIdContext } from "./context";
import { useParams } from "react-router";
import { RandomProvider } from "../../spa-components/RandomProvider";

type Props = {
  children: React.ReactNode;
  puzzleId?: string;
};

const todayId = () => {
  const today = new Date();
  return [
    today.getFullYear(),
    `0${today.getMonth() + 1}`.substr(-2),
    `0${today.getDate()}`.substr(-2),
  ].join("-");
};

export const PuzzleIdProvider = ({
  children,
  puzzleId: initialPuzzleId,
}: Props) => {
  const { puzzleId = initialPuzzleId ?? todayId() } = useParams();

  return (
    <PuzzleIdContext.Provider key={puzzleId} value={{ puzzleId }}>
      <RandomProvider seed={puzzleId}>{children}</RandomProvider>
    </PuzzleIdContext.Provider>
  );
};
