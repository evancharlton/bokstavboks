import { MdHelpOutline, MdMenu } from "react-icons/md";
import { useParams } from "react-router";
import { useDialog } from "../Dialogs";
import logo from "../../logo.svg";
import { Header as SpaHeader } from "../../spa-components/Header";

const Buttons = () => {
  const { lang = "" } = useParams();
  const { show } = useDialog();
  return (
    <>
      <button title="Hjelp med Bokstavboks" onClick={() => show("help")}>
        <MdHelpOutline />
      </button>
      {lang ? (
        <button title="Flere handlinger" onClick={() => show("hamburger")}>
          <MdMenu />
        </button>
      ) : null}
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
