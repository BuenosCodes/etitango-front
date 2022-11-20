import Home from '../modules/home/Home';
import HistoriaEti from '../modules/home/historia-del-ETI/HistoriaEti';
import ManifiestoETiano from '../modules/home/manifiesto-etiano/ManifistoEtiano';
import ComisionGeneroContact from '../modules/home/comision-de-genero/ComisionGeneroContact';
import ComisionGeneroProtocol from '../modules/home/comision-de-genero/ComisionGeneroProtocol';
import ComisionGeneroWho from '../modules/home/comision-de-genero/comisionGeneroWho';
import Inscripcion from '../modules/inscripcion/Inscripcion';
import SignupList from '../modules/inscripcion/SignupList';
import SignInScreen from '../modules/signIn/signIn';
import Form from '../components/form/Form.js';
import SuperAdmin from '../modules/superAdmin/superAdmin';

const Routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'historia-del-eti',
    element: <HistoriaEti />
  },
  {
    path: 'manifiesto-etiano',
    element: <ManifiestoETiano />
  },
  {
    path: 'comision-de-genero-contact',
    element: <ComisionGeneroContact />
  },
  {
    path: 'comision-de-genero-protocol',
    element: <ComisionGeneroProtocol />
  },
  {
    path: 'comision-de-genero-who',
    element: <ComisionGeneroWho />
  },
  {
    path: 'inscripcion',
    element: <Inscripcion />
  },
  {
    path: 'lista-inscriptos',
    element: <SignupList />
  },
  {
    path: 'sign-in',
    element: <SignInScreen />
  },
  {
    path: 'super-admin',
    element: <SuperAdmin />
  },
  //TODO this should be removed
  {
    path: 'form-example',
    element: <Form />
  }
];

export default Routes;
