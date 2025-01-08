import "./App.css";
import { HashRouter, Outlet, Route, Routes } from "react-router";
import { Play } from "./pages/Play";
import { Dialogs } from "./components/Dialogs";
import { Toaster } from "./components/Toaster";
import { SettingsProvider } from "./components/SettingsProvider";
import LanguageSelector from "./spa-components/LanguageSelector";
import PwaContainer from "./spa-components/PwaContainer";
import { Page } from "./components/Page";
import { DataFetcher } from "./components/WordsProvider";

function App() {
  return (
    <Toaster>
      <PwaContainer appId="bokstavboks">
        <SettingsProvider>
          <Dialogs>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Page />}>
                  <Route path="" element={<LanguageSelector />} />
                  <Route
                    path=":lang"
                    element={
                      <DataFetcher>
                        <Outlet />
                      </DataFetcher>
                    }
                  >
                    <Route index element={<Play />} />
                    <Route path=":puzzleId" element={<Play />} />
                  </Route>
                </Route>
              </Routes>
            </HashRouter>
          </Dialogs>
        </SettingsProvider>
      </PwaContainer>
    </Toaster>
  );
}

export default App;
