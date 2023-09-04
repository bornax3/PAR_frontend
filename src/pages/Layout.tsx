import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const Layout = () => {
  return (
    <main className="App">
      <Nav />
      <Sidebar />
      <Outlet />
    </main>
  );
};

export default Layout;
