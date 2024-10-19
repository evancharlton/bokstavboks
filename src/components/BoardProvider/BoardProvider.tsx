import { useCallback, useEffect, useReducer, useRef } from "react";
import { isLetters, neverGuard } from "../../types";
import { BoardContext } from "./context";
import { usePuzzleId } from "../PuzzleIdProvider";
import { WordsProvider, useWords } from "../WordsProvider";
import { Loader } from "../Loader";
import { State } from "./types";
import { useNavigate, useParams } from "react-router";
import { extractBoardId } from "./extractBoardId";
import { useStorage } from "../../useStorage";
import { normalizeId } from "../../utils";

type Action =
  | { action: "set-board"; boardId: string; seeds?: string[] }
  | { action: "shuffle" };

const shuffle = <T,>(arr: T[]): T[] =>
  arr
    .map((v) => ({ v, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ v }) => v);

const shuffleId = (boardId: string): string =>
  shuffle(
    [
      [boardId[0], boardId[1], boardId[2]],
      [boardId[3], boardId[4], boardId[5]],
      [boardId[6], boardId[7], boardId[8]],
      [boardId[9], boardId[10], boardId[11]],
    ].map((arr) => shuffle(arr).join(""))
  ).join("");

const reducer = (state: State, update: Action): State => {
  const { action } = update;
  switch (action) {
    case "set-board": {
      const { boardId } = update;
      if (boardId.length !== 12) {
        throw new Error("Invalid board ID provided");
      }

      if (!isLetters(boardId)) {
        throw new Error("Invalid board ID:" + boardId);
      }

      const id = normalizeId(boardId);
      const display = shuffleId(boardId);

      return {
        ...state,
        id,
        display,
        groups: [
          id.indexOf(display[0]),
          id.indexOf(display[3]),
          id.indexOf(display[6]),
          id.indexOf(display[9]),
        ].map((i) => Math.floor(i / 3)) as unknown as State["groups"],
      };
    }

    case "shuffle": {
      return {
        ...state,
        display: shuffleId(state.id),
      };
    }

    default: {
      return neverGuard(action, state);
    }
  }
};

type Props = {
  children: React.ReactNode;
} & Partial<State>;

export const BoardProvider = ({ children, ...initialState }: Props) => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { words: wordBank } = useWords();
  const { puzzleId, random } = usePuzzleId();

  const [{ id, display, groups }, dispatch] = useReducer(reducer, {
    id: "",
    display: "",
    groups: [0, 0, 0, 0],
    ...initialState,
  } satisfies State);

  const ids = useStorage("ids");

  const prevPuzzleId = useRef<string>();
  useEffect(() => {
    if (prevPuzzleId.current === puzzleId) {
      return;
    }
    prevPuzzleId.current = puzzleId;

    ids
      .getItem("board")
      .then(async (value): Promise<string> => {
        if (
          value &&
          typeof value === "string" &&
          value.length === 12 &&
          isLetters(value)
        ) {
          return value;
        }
        return extractBoardId(puzzleId, random, wordBank);
      })
      .then((boardId) => {
        dispatch({ action: "set-board", boardId });
        ids.setItem(puzzleId, boardId);
      });
  }, [puzzleId, random, ids, wordBank]);

  // Context API stuff

  const randomize = useCallback(() => {
    navigate(`/${lang}/${Date.now()}`);
  }, [lang, navigate]);

  const url = `${window.location.protocol}//${
    window.location.host
  }/${window.location.pathname.replace(/^\//, "")}#/${lang}/${id}`;

  const shuffle = useCallback(() => {
    dispatch({ action: "shuffle" });
  }, []);

  if (!display) {
    return <Loader text="generere puslespill ..." />;
  }

  const idLetters = new Set(id);
  const relevantWords = wordBank.filter((word) => {
    for (let i = 0; i < word.length; i += 1) {
      if (!idLetters.has(word[i])) {
        return false;
      }
    }
    return true;
  });

  return (
    <BoardContext.Provider
      key={id}
      value={{
        id,
        display,
        groups,
        shuffle,
        randomize,
        url,
      }}
    >
      <WordsProvider key={id} words={relevantWords}>
        {children}
      </WordsProvider>
    </BoardContext.Provider>
  );
};
