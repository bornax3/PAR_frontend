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
import Developer from "./pages/Developer";
import Schools from "./pages/Schools";
import Admins from "./pages/Admins";
import Professors from "./pages/Professors";
import Files from "./pages/Files";

function App() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* admin (promijenjeno da nema / za layout, vidi ako to stvara probleme da tako bude i dalje)*/}
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
