import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isExpired } from "react-jwt";
import "./css/App.css";

// Pages and Components
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Missing from "./pages/Missing";
import Unauthorized from "./pages/Unauthorized";
import Layout from "./pages/Layout";
import SchoolAdmin from "./pages/SchoolAdmin";
import Account from "./pages/Account";
import Developer from "./pages/Developer";
import Schools from "./pages/Schools";
import Admins from "./pages/Admins";
import Professors from "./pages/Professors";
import Files from "./pages/Files";
import RequireAuth from "./components/RequireAuth";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const isMyTokenExpired = token ? isExpired(token) : false;

  // Handle expired token
  useEffect(() => {
    if (isMyTokenExpired) {
      navigate("/login", { state: { isSessionExpired: true } });
      localStorage.clear();
    }
  }, [isMyTokenExpired]);

  return (
    <Routes>
      {/* public routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* admin */}
      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route element={<Layout />}>
          <Route path="/developer" element={<Developer />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/professors" element={<Professors />} />
          <Route path="/files" element={<Files />} />
        </Route>
      </Route>

      {/* admin and korisnik */}
      <Route element={<RequireAuth allowedRoles={["admin", "korisnik"]} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>

      {/* admin and voditeljUstanove */}
      <Route
        element={<RequireAuth allowedRoles={["admin", "voditeljUstanove"]} />}
      >
        <Route element={<Layout />}>
          <Route path="/admin" element={<SchoolAdmin />} />
        </Route>
      </Route>

      {/* Common routes */}
      <Route
        element={
          <RequireAuth
            allowedRoles={["admin", "korisnik", "voditeljUstanove"]}
          />
        }
      >
        <Route element={<Layout />}>
          <Route path="account" element={<Account />} />
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
