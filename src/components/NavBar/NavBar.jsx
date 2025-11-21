import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";

export const NavBar = () => {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      <nav className="navbar">
        <ul className="navbar__list">
          <li>
            <NavLink className="navbar__link-home" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
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
