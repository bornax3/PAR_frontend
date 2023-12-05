import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import "../css/Layout.css";

const Layout = () => {
  return (
    <>
      <Nav />
      <Sidebar />
      <div className="content-container">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
