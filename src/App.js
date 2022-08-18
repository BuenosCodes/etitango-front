import { Route, Routes } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import {useState} from "react";

import routes from "./routes/Routes";
import withRoot from "./components/withRoot";
import EtiAppBar from "./components/EtiAppBar";
import {UserContext} from "./helpers/UserContext";

i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    lng: 'es', //TODO this could be set from user info
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    nsSeparator: '.'
  });

function App() {
  const [user, setUser] = useState({ user: {} });
  return (
    <div className="">
      <UserContext.Provider value={{ user, setUser }}>
        <EtiAppBar />
        <Routes>
          {routes.map((route, i) => (
            <Route key={i} path={route.path} exact element={route.element} />
          ))}
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default withRoot(App);
