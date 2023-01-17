import { Route, Routes } from 'react-router-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { useState } from 'react';

import withRoot from './components/withRoot';
import EtiAppBar from './components/EtiAppBar';
import AppFooter from './components/AppFooter';
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
import EventsList from './modules/superAdmin/events/EventsList';
import Profile from './modules/user/profile';
import UserHome from './modules/user/index';
import Home from './modules/home/Home';
import Bank from './modules/user/profile/bank';
import withUserMenu from './components/withUserMenu';
import EventForm from './modules/superAdmin/events/EventForm';
import TemplatesList from './modules/superAdmin/templates';
import EditTemplate from './modules/superAdmin/templates/EditTemplate';
import RolesList from './modules/superAdmin/roles/RolesList';

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

export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
  SUPERADMIN: '/super-admin',
  PROFILE: '/user/profile',
  USER: '/user',
  USER_HOME: '/user',
  SIGN_IN: '/sign-in',
  SIGNUP: '/inscripcion',
  SIGNUPS: '/lista-inscriptos',
  BANKS: '/banks',
  ROLES: '/roles',
  TEMPLATES: '/templates'
};

export const PRIVATE_ROUTES = [
  ROUTES.PROFILE,
  ROUTES.USER,
  ROUTES.USER_HOME,
  ROUTES.SIGNUP,
  ROUTES.SIGNUPS
];

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
          <Route path={ROUTES.SIGNUP} element={withUserMenu(Inscripcion)()} exact />
          <Route path={ROUTES.SIGNUPS} element={withUserMenu(SignupList)()} exact />
          <Route path={ROUTES.SIGN_IN} element={<SignInScreen />} exact />
          <Route path={ROUTES.SUPERADMIN} element={<SuperAdmin />} />
          <Route path={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}`} element={<EventsList />} />
          <Route path={`${ROUTES.SUPERADMIN}${ROUTES.EVENTS}/:id`} element={<EventForm />} />
          <Route path={`${ROUTES.SUPERADMIN}${ROUTES.ROLES}`} element={<RolesList />} />
          <Route path={ROUTES.USER} element={withUserMenu(UserHome)()} />
          <Route path={`${ROUTES.BANKS}/:id`} element={<Bank />} />
          <Route path={ROUTES.PROFILE} element={withUserMenu(Profile)()} />
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={`${ROUTES.SUPERADMIN}${ROUTES.TEMPLATES}`} element={<TemplatesList />} />
          <Route path={`${ROUTES.SUPERADMIN}${ROUTES.TEMPLATES}/:id`} element={<EditTemplate />} />
        </Routes>
        <AppFooter />
      </UserContext.Provider>
    </div>
  );
}

export default withRoot(App);
