import { Routes, Route } from "react-router-dom";
import "./css/App.css";

// Components
import Register from "./pages/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import Missing from "./pages/Missing";
import AccountSettings from "./pages/AccountSettings";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import Layout from "./pages/Layout";

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* protected routes */}
      <Route element={<RequireAuth allowedRoles={["admin", "korisnik"]} />}>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<AccountSettings />} />
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
