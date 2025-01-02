import "./App.css";
import { HashRouter, Route, Routes } from "react-router";
import { Play } from "./pages/Play";
import { WordsProvider } from "./components/WordsProvider";
import { Page } from "./components/Page";
import { Dialogs } from "./components/Dialogs";
import { Toaster } from "./components/Toaster";
import { SettingsProvider } from "./components/SettingsProvider";
import LanguageSelector from "./spa-components/LanguageSelector";
import PwaContainer from "./spa-components/PwaContainer";
import { Header } from "./components/Header";

function App() {
  return (
    <Toaster>
      <PwaContainer>
        <SettingsProvider>
          <HashRouter>
            <Routes>
              <Route
                index
                element={
                  <Dialogs>
                    <Page header={<Header />}>
                      <LanguageSelector />
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
      </PwaContainer>
    </Toaster>
  );
}

export default App;
