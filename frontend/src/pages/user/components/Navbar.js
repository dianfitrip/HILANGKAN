import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="logo-container">
          <img src="/images/LogoUMY.png" alt="UMY" className="logo-image" />
          <div className="logo-divider"></div>
          <img
            src="/images/LogoLostFound.png"
            alt="Lost & Found"
            className="logo-image"
          />
        </div>
      </div>

      <div className="navbar-bottom">
        <div className="navbar-container">
          <ul className="nav-menu">
            <li>
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                HOME
              </Link>
            </li>

            <li>
              <Link
                to="/prosedur"
                className={`nav-link ${isActive("/prosedur") ? "active" : ""}`}
              >
                PROSEDUR
              </Link>
            </li>

            <li>
              <Link
                to="/list"
                className={`nav-link ${isActive("/list") ? "active" : ""}`}
              >
                LIST BARANG TEMUAN
              </Link>
            </li>

            <li
              className="dropdown-container"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div
                className={`dropdown-trigger-box ${
                  isDropdownOpen || location.pathname.includes("/lapor")
                    ? "active"
                    : ""
                }`}
              >
                <span>LAYANAN MANDIRI</span>
                <ChevronDown
                  size={16}
                  className={`dropdown-icon ${
                    isDropdownOpen ? "rotate" : ""
                  }`}
                />
              </div>

              <ul className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                <li>
                  <Link to="/lapor-kehilangan" className="dropdown-item">
                    Laporkan Kehilangan
                  </Link>
                </li>
                <li>
                  <Link to="/lapor-penemuan" className="dropdown-item">
                    Laporkan Penemuan
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;