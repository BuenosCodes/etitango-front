import Home from "../modules/home/Home";
import HistoriaEti from "../modules/home/historia-del-ETI/HistoriaEti";
import ManifiestoETiano from "../modules/home/manifiesto-etiano/ManifistoEtiano";
import Inscripcion from "../modules/inscripcion/Inscripcion";
import InscripcionList from "../modules/inscripcion/InscripcionList";
import SignInScreen from "../modules/signIn/signIn";

const Routes = [
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "historia-del-eti",
        element: <HistoriaEti/>,
    },
    {
        path: "manifiesto-etiano",
        element: <ManifiestoETiano/>,
    },
    {
        path: "inscripcion",
        element: <Inscripcion/>,
    },
    {
        path: "lista-inscriptos",
        element: <InscripcionList/>,
    },
    {
        path: "sign-in",
        element: <SignInScreen/>,
    },
];

export default Routes;
