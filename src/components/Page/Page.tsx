import { MdOutlineRefresh } from "react-icons/md";
import { usePwa } from "../PwaContainer";
import classes from "./Page.module.css";

type Props = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export const Page = ({ header, children }: Props) => {
  const { updateNeeded, performUpdate } = usePwa();

  return (
    <div className={classes.container}>
      {header}
      {updateNeeded ? (
        <div className={classes.pwaContainer}>
          oppdatering tilgjengelig
          <button onClick={() => performUpdate()}>
            <MdOutlineRefresh />
          </button>
        </div>
      ) : null}
      <div className={classes.content}>{children}</div>
    </div>
  );
};
