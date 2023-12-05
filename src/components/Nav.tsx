import React, { useState, useEffect, useRef, useContext } from "react";
//import "../css/Nav.css";
import "../css/Layout.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaInfo } from "react-icons/fa";
import AuthContext from "../context/AuthProvider";
import { Modal } from "antd";

const Nav: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const roles = useContext(AuthContext);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Reverse the pathSegments array to display the hierarchy in reverse order
  const reversedSegments = [...pathSegments].reverse();

  // Ensure "developer" is always included as the first segment
  if (!reversedSegments.includes("developer")) {
    reversedSegments.unshift("developer");
  }

  const showModal = () => {
    setMenuOpen(false);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="navbar">
      {/* <div className="breadcrumb">
        {reversedSegments.map((segment, index) => {
          const path = `/${reversedSegments.slice(index).reverse().join("/")}`;
          return (
            <span key={index}>
              <Link to={segment} className="breadcrumb-link">
                {segment}
              </Link>
              {index < reversedSegments.length - 1 && " > "}
            </span>
          );
        })}
      </div> */}
      <div className="home-icon-div">
        <Link to={destination} title="Polazno" className="home-icon">
          <FaHome size={30} />
        </Link>
      </div>
      <div
        title="Meni"
        className={`menu-icon ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {menuOpen && (
        <div className="dropdown" ref={navRef}>
          <ul className="menu-dropdown">
            <li className="dropdown-list-item" onClick={handleLogout}>
              <a className="menu-button">
                <FaSignOutAlt />
                &nbsp;&nbsp;&nbsp; Odjava
              </a>
            </li>
            <li className="dropdown-list-item" onClick={showModal}>
              <a className="menu-button">
                <FaInfo />
                &nbsp;&nbsp;&nbsp; Pravilnik
              </a>
            </li>
          </ul>
        </div>
      )}
      <Modal
        title="Pravilnik o napredovanju"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={820}
        bodyStyle={{ height: "700px" }}
        footer={null}
      >
        <iframe
          src="https://narodne-novine.nn.hr/clanci/sluzbeni/2019_07_68_1372.html"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ pointerEvents: "auto" }}
        />
      </Modal>
    </nav>
  );
};

export default Nav;
