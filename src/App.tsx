import "./App.css";
import { HashRouter, Link, Route, Routes } from "react-router-dom";
import Builder from "./pages/Builder";
import { Play } from "./pages/Play";
import { WordsProvider } from "./components/WordsProvider";
import { BoardProvider } from "./components/BoardProvider";
import { PuzzleIdProvider } from "./components/PuzzleIdProvider";

const LanguageSelect = () => {
  return (
    <div>
      <h1>Language</h1>
      <Link to="/nb">NB</Link>
      <Link to="/nn">NN</Link>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<LanguageSelect />} />
          <Route
            path="/:lang/build"
            element={
              <WordsProvider>
                <Builder />
              </WordsProvider>
            }
          />
          <Route
            path="/:lang/:puzzleId"
            element={
              <WordsProvider>
                <PuzzleIdProvider>
                  <BoardProvider>
                    <Play />
                  </BoardProvider>
                </PuzzleIdProvider>
              </WordsProvider>
            }
          />
          <Route
            path="/:lang"
            element={
              <WordsProvider>
                <PuzzleIdProvider>
                  <BoardProvider>
                    <Play />
                  </BoardProvider>
                </PuzzleIdProvider>
              </WordsProvider>
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
