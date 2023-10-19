import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Builder from "./pages/Builder";
import { Play } from "./pages/Play";
import { WordsProvider } from "./components/WordsProvider";
import { PuzzleIdProvider } from "./components/PuzzleIdProvider";
import { Header } from "./components/Header";
import { Page } from "./components/Page";
import { LanguageSelect } from "./pages/LanguageSelect";
import { Dialogs } from "./components/Dialogs";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PuzzleIdProvider>
              <Page header={<Header />}>
                <LanguageSelect />
              </Page>
            </PuzzleIdProvider>
          }
        />
        <Route
          path="/:lang/build"
          element={
            <WordsProvider>
              <Builder />
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
