import React, { useState } from "react";
//import "../css/Sidebar.css";
import "../css/Layout.css";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">General Settings</div>
      <ul className="sidebar-items">
        <li>
          <Link to="/account" className="sidebar-item">
            Account
          </Link>
        </li>
      </ul>
      {/* <div className="sidebar-handle" onClick={toggleSidebar}>
        {isSidebarOpen ? "←" : "→"}
      </div> */}
    </div>
  );
};

export default Sidebar;
