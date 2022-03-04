import Home from "../modules/home/Home";
import HistoriaEti from "../modules/home/historia-del-ETI/HistoriaEti";
import ManifiestoETiano from "../modules/home/manifiesto-etiano/ManifistoEtiano";
const Routes = [
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
];

export default Routes;
