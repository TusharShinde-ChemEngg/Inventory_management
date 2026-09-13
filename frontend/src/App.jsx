import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Layout from "./components/Layout";
import Receive from "./pages/Receive";
import Dispatch from "./pages/Dispatch";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* MAIN APP */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
  path="/receive"
  element={<Receive />}
/>
<Route
  path="/dispatch"
  element={<Dispatch />}
/>
<Route
  path="/history"
  element={<History />}
/>
          <Route
            path="/products"
            element={<Products />}
          />

        </Route>

        {/* DEFAULT */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;