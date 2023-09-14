import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import "../css/Layout.css";

const Layout = () => {
  return (
    <div className="layout-container">
      <Nav />
      <div className="content-container">
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
