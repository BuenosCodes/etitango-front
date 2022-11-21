import { Route, Routes } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { useState } from 'react';

import withRoot from './components/withRoot';
import EtiAppBar from './components/EtiAppBar';
import { UserContext } from './helpers/UserContext';
import HistoriaEti from './modules/home/historia-del-ETI/HistoriaEti';
import ManifiestoETiano from './modules/home/manifiesto-etiano/ManifistoEtiano';
import ComisionGeneroContact from './modules/home/comision-de-genero/ComisionGeneroContact';
import ComisionGeneroProtocol from './modules/home/comision-de-genero/ComisionGeneroProtocol';
import ComisionGeneroWho from './modules/home/comision-de-genero/comisionGeneroWho';
import Inscripcion from './modules/inscripcion/Inscripcion';
import SignupList from './modules/inscripcion/SignupList';
import SignInScreen from './modules/signIn/signIn';
import SuperAdmin from './modules/superAdmin/index';
import EventsList from './modules/superAdmin/events/index';

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

const ROUTES = { EVENTS: 'events', SUPERADMIN: 'super-admin' };
function App() {
  const [user, setUser] = useState({ user: {} });
  return (
    <div className="">
      <UserContext.Provider value={{ user, setUser }}>
        <EtiAppBar />
        <Routes>
          <Route path="historia-del-eti" element={<HistoriaEti />} exact />
          <Route path="manifiesto-etiano" element={<ManifiestoETiano />} exact />
          <Route path="comision-de-genero-contact" element={<ComisionGeneroContact />} exact />
          <Route path="comision-de-genero-protocol" element={<ComisionGeneroProtocol />} exact />
          <Route path="comision-de-genero-who" element={<ComisionGeneroWho />} exact />
          <Route path="inscripcion" element={<Inscripcion />} exact />
          <Route path="lista-inscriptos" element={<SignupList />} exact />
          <Route path="sign-in" element={<SignInScreen />} exact />
          <Route path={ROUTES.SUPERADMIN} element={<SuperAdmin />} />
          <Route path={`${ROUTES.SUPERADMIN}/${ROUTES.EVENTS}`} element={<EventsList />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default withRoot(App);
