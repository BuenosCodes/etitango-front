import { Routes, Route } from "react-router-dom";
// import Dashboard from './modules/dashboard/Dashboard';
import SignIn from "./modules/login/SignIn";
import SignUp from "./modules/login/SignUp";
import routes from "./routes/Routes";
import withRoot from "./components/withRoot";

function App() {
  return (
    <div className="">
      <Routes>
        {routes.map((route) => (
          <Route path={route.path} exact element={route.element} />
        ))}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default withRoot(App);
