import { Routes, Route } from "react-router-dom";
import "./css/App.css";

// Pages and Components
import Register from "./pages/Register";
import Login from "./components/Login";
import Home from "./pages/Home";
import Missing from "./pages/Missing";
import Unauthorized from "./pages/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import Layout from "./pages/Layout";
import SchoolAdmin from "./pages/SchoolAdmin";
import Account from "./pages/Account";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* admin and korisnik */}
      <Route element={<RequireAuth allowedRoles={["admin", "korisnik"]} />}>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>

      {/* admin and voditeljUstanove */}
      <Route
        element={<RequireAuth allowedRoles={["admin", "voditeljUstanove"]} />}
      >
        <Route path="/" element={<Layout />}>
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
        <Route path="/" element={<Layout />}>
          <Route path="account" element={<Account />} />
        </Route>
      </Route>

      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
