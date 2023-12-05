import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Layout.css";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { FaUser } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = () => {
    navigate("/account");
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header">Postavke</div>
      <MenuList>
        <MenuItem className="menuItem" onClick={handleItemClick}>
          <a className="sidebar-item">
            <FaUser />
            &nbsp;&nbsp;&nbsp; Profil
          </a>
        </MenuItem>
      </MenuList>
      <div className="sidebar-handle" onClick={toggleSidebar}>
        {isSidebarOpen ? "←" : "→"}
      </div>
    </div>
  );
};

export default Sidebar;
