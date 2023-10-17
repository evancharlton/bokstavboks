import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Builder from "./pages/Builder";
import { Play } from "./pages/Play";
import { WordsProvider } from "./components/WordsProvider";
import { BoardProvider } from "./components/BoardProvider";
import { PuzzleIdProvider } from "./components/PuzzleIdProvider";
import { GameState } from "./components/GameState";
import { Header } from "./components/Header";
import { Page } from "./components/Page";
import { LanguageSelect } from "./pages/LanguageSelect";

const GameTime = () => (
  <PuzzleIdProvider>
    <Page header={<Header />}>
      <WordsProvider>
        <BoardProvider>
          <GameState>
            <Play />
          </GameState>
        </BoardProvider>
      </WordsProvider>
    </Page>
  </PuzzleIdProvider>
);

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
        <Route path="/:lang/:puzzleId" element={<GameTime />} />
        <Route path="/:lang" element={<GameTime />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
