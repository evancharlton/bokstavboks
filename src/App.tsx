import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Builder from "./pages/Builder";
import { Play } from "./pages/Play";
import { WordsProvider } from "./components/WordsProvider";
import { BoardProvider } from "./components/BoardProvider";
import { PuzzleIdProvider } from "./components/PuzzleIdProvider";
import { GameState, useGameState } from "./components/GameState";
import { Header } from "./components/Header";
import { Page } from "./components/Page";
import { LanguageSelect } from "./pages/LanguageSelect";
import { useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { Dialog } from "./components/Dialog";

const GameTime = () => {
  const Buttons = () => {
    const { solve, complete } = useGameState();
    const [dialog, setDialog] = useState<"solve" | undefined>();

    return (
      <>
        {!complete && (
          <button onClick={() => setDialog("solve")}>
            <MdOutlineDone />
          </button>
        )}
        {dialog === "solve" && (
          <Dialog title="Løsningen" onClose={() => setDialog(undefined)}>
            <div>
              <p>Are you sure?</p>
              <button
                onClick={() => {
                  solve();
                  setDialog(undefined);
                }}
              >
                Yes
              </button>
            </div>
          </Dialog>
        )}
      </>
    );
  };

  return (
    <PuzzleIdProvider>
      <WordsProvider>
        <BoardProvider>
          <GameState>
            <Page header={<Header buttons={<Buttons />} />}>
              <Play />
            </Page>
          </GameState>
        </BoardProvider>
      </WordsProvider>
    </PuzzleIdProvider>
  );
};

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
