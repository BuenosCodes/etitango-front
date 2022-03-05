import { Routes, Route } from "react-router-dom";
// import Dashboard from './modules/dashboard/Dashboard';

import routes from "./routes/Routes";
import withRoot from "./components/withRoot";

function App() {
  return (
    <div className="">
      <Routes>
        {routes.map((route, i) => (
          <Route key={i} path={route.path} exact element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default withRoot(App);
