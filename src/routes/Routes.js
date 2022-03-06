import Home from "../modules/home/Home";
import HistoriaEti from "../modules/home/historia-del-ETI/HistoriaEti";
import ManifiestoETiano from "../modules/home/manifiesto-etiano/ManifistoEtiano";
import Inscripcion from "../modules/inscripcion/Inscripcion";
const Routes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "home",
    element: <Home />,
  },
  {
    path: "historia-del-eti",
    element: <HistoriaEti />,
  },
  {
    path: "manifiesto-etiano",
    element: <ManifiestoETiano />,
  },
  {
    path: "inscripcion",
    element: <Inscripcion />,
  },
];

export default Routes;
