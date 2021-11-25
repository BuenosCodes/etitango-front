import { Routes, Route } from "react-router-dom";
import Dashboard from './modules/dashboard/Dashboard';
import Home from "./modules/home/Home"

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" exact element={<Home />}>

        </Route>
        <Route path="/dashboard" element={<Dashboard />}>

        </Route>
      </Routes>
    </div>
  );
}

export default App;
