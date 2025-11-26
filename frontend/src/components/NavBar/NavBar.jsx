import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";

export const NavBar = ({ isMobileMenuOpen, onCloseMobileMenu }) => {
  const { currentUser } = useContext(CurrentUserContext);

  const handleLinkClick = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      <nav
        className={`navbar ${isMobileMenuOpen ? "navbar--mobile-open" : ""}`}
      >
        <ul className="navbar__list">
          <li>
            <NavLink
              className="navbar__link-home"
              to="/"
              onClick={handleLinkClick}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `navbar__link${isActive ? " navbar__link-active" : ""}${
                  !currentUser ? " navbar__link-disabled" : ""
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reviews"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `navbar__link${isActive ? " navbar__link-active" : ""}${
                  !currentUser ? " navbar__link-disabled" : ""
                }`
              }
            >
              Reviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/aboutMe"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `navbar__link${isActive ? " navbar__link-active" : ""}${
                  !currentUser ? " navbar__link-disabled" : ""
                }`
              }
            >
              About Me
            </NavLink>
          </li>
        </ul>
      </nav>
    </CurrentUserContext.Provider>
  );
};
