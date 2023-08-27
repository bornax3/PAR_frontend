import React, { useState } from "react";
import "../css/Nav.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Nav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="home-icon-div">
        <Link to="/" title="Home" className="home-icon">
          <FaHome size={30} />
        </Link>
      </div>
      <div
        title="Menu"
        className={`menu-icon ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {menuOpen && (
        <ul className="menu-dropdown">
          <li>
            <Link to="/account" className="menu-item">
              Account Settings
            </Link>
          </li>
          <li>
            <button className="menu-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Nav;
