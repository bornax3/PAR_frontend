import React, { useState, useEffect, useRef, useContext } from "react";
//import "../css/Nav.css";
import "../css/Layout.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import AuthContext from "../context/AuthProvider";

const Nav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const roles = useContext(AuthContext);
  const location = useLocation();

  let destination = ""; // Default destination

  // Check the user's role and set the destination accordingly
  if (roles && roles.roles && roles.roles.includes("voditeljUstanove")) {
    destination = "/admin";
  } else if (roles && roles.roles && roles.roles.includes("korisnik")) {
    destination = "/";
  } else if (roles && roles.roles && roles.roles.includes("admin")) {
    destination = "/developer";
  }

  const toggleMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    // prevent the click event from reaching the document-level click listener responsible for closing the menu
    event.stopPropagation();
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Event listener to close the menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuOpen]);

  // Create a breadcrumb navigation based on the current pathname
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="navbar">
      <div className="breadcrumb">
        {pathSegments.map((segment, index) => (
          <span key={index}>
            <Link to={"/" + pathSegments.slice(0, index + 1).join("/")}>
              {segment}
            </Link>
            {index < pathSegments.length - 1 && " > "}
          </span>
        ))}
      </div>
      <div className="home-icon-div">
        <Link to={destination} title="Home" className="home-icon">
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
        <div ref={navRef}>
          <ul className="menu-dropdown">
            <li>
              <button className="menu-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
