import {Route, Routes} from "react-router-dom";
import routes from "./routes/Routes";
import withRoot from "./components/withRoot";
import EtiAppBar from "./components/EtiAppBar";

function App() {
    return (
        <div className="">
            <EtiAppBar/>
            <Routes>
                {routes.map((route, i) => (
                    <Route key={i} path={route.path} exact element={route.element}/>
                ))}
            </Routes>
        </div>
    );
}

export default withRoot(App);
