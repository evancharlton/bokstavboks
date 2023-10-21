import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { BuildById } from "./pages/Builder/BuildById";
import { Play } from "./pages/Play";
import { WordsProvider } from "./components/WordsProvider";
import { Header } from "./components/Header";
import { Page } from "./components/Page";
import { LanguageSelect } from "./pages/LanguageSelect";
import { Dialogs } from "./components/Dialogs";
import { Builder } from "./pages/Builder";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Dialogs>
              <Page header={<Header />}>
                <LanguageSelect />
              </Page>
            </Dialogs>
          }
        />
        <Route
          path="/:lang/build"
          element={
            <WordsProvider>
              <Dialogs>
                <Page header={<Header />}>
                  <Builder />
                </Page>
              </Dialogs>
            </WordsProvider>
          }
        />
        <Route
          path="/:lang/build/id"
          element={
            <WordsProvider>
              <Dialogs>
                <Page header={<Header />}>
                  <BuildById />
                </Page>
              </Dialogs>
            </WordsProvider>
          }
        />
        <Route
          path="/:lang/build/words"
          element={
            <WordsProvider>
              <Dialogs>
                <Page header={<Header />}>
                  <BuildById />
                </Page>
              </Dialogs>
            </WordsProvider>
          }
        />
        <Route path="/:lang/:puzzleId" element={<Play />} />
        <Route path="/:lang" element={<Play />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
