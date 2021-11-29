import { Routes, Route } from "react-router-dom";
// import Dashboard from './modules/dashboard/Dashboard';
import SignIn from "./modules/login/SignIn";
import SignUp from "./modules/login/SignUp";
import Home from "./modules/home/Home";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" exact element={<Home />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
