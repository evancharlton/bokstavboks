import { Outlet } from "react-router";
import { Header } from "../Header";
import classes from "./Page.module.css";

export const Page = () => {
  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
};
