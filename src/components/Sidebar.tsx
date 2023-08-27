import React, { useState } from "react";
import "../css/Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">Sidebar</div>
      <ul className="sidebar-items">
        <li>
          <Link to="/account" className="sidebar-item">
            Account Settings
          </Link>
        </li>
        <li>
          <Link to="/" className="sidebar-item">
            Home
          </Link>
        </li>
      </ul>
      <div className="sidebar-handle" onClick={toggleSidebar}>
        {isSidebarOpen ? "←" : "→"}
      </div>
    </div>
  );
};

export default Sidebar;
