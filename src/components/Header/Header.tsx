import { MdHelpOutline } from "react-icons/md";
import { useDialog } from "../Dialogs";
import logo from "../../logo.svg";
import { Header as SpaHeader } from "../../spa-components/Header";

const Buttons = () => {
  const { show } = useDialog();
  return (
    <>
      <button title="Hjelp med Bokstavboks" onClick={() => show("help")}>
        <MdHelpOutline />
      </button>
    </>
  );
};

export const Header = () => {
  return (
    <SpaHeader title="Bokstavboks" logo={logo}>
      <Buttons />
    </SpaHeader>
  );
};
