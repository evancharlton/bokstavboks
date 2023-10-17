import classes from "./Page.module.css";

type Props = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export const Page = ({ header, children }: Props) => {
  return (
    <div className={classes.container}>
      {header}
      <div className={classes.content}>{children}</div>
    </div>
  );
};
