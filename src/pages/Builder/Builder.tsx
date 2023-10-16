import { useCallback, useMemo, useState } from "react";
import classes from "./Builder.module.css";
import { Words } from "./Words";
import { Letter } from "../../types";
import { addLetter, createBoard } from "../../logic";
import { Grid } from "../../components/Grid";

export const Builder = () => {
  const [sequence, setSequence] = useState<Letter[]>([]);
  const [building, setBuilding] = useState(false);

  const boards = useMemo(() => {
    setBuilding(true);
    try {
      const [first, ...rest] = sequence;
      if (!first) {
        return [];
      }

      let boards = [createBoard(first)];
      for (const next of rest) {
        boards = addLetter(boards, next);
      }

      return boards;
    } finally {
      setBuilding(false);
    }
  }, [sequence]);

  const onChange = useCallback((seq: Letter[]) => {
    setSequence(seq);
  }, []);

  return (
    <div className={classes.container}>
      <Words onChange={onChange} />
      <h1>
        {boards.length} boards {boards[0]?.sequence ?? "pending"}
      </h1>
      <div className={classes.boards} key={sequence.join("")}>
        {building && <h1>building ...</h1>}
        {boards[0] && <Grid input="" />}
      </div>
    </div>
  );
};
