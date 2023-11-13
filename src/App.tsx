import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Play } from "./pages/Play";
import { WordsProvider } from "./components/WordsProvider";
import { Header } from "./components/Header";
import { Page } from "./components/Page";
import { LanguageSelect } from "./pages/LanguageSelect";
import { Dialogs } from "./components/Dialogs";
import { Toaster } from "./components/Toaster";
import { SettingsProvider } from "./components/SettingsProvider";

function App() {
  return (
    <Toaster>
      <SettingsProvider>
        <HashRouter>
          <Routes>
            <Route
              index
              element={
                <Dialogs>
                  <Page header={<Header />}>
                    <LanguageSelect />
                  </Page>
                </Dialogs>
              }
            />
            <Route path=":lang" element={<WordsProvider />}>
              <Route index element={<Play />} />
              <Route path=":puzzleId" element={<Play />} />
            </Route>
          </Routes>
        </HashRouter>
      </SettingsProvider>
    </Toaster>
  );
}

export default App;
