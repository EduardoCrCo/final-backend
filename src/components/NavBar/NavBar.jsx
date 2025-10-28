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
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `navbar__link${isActive ? " navbar__link--active" : ""}${
                  !currentUser ? " navbar__link--disabled" : ""
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
                `navbar__link${isActive ? " navbar__link--active" : ""}${
                  !currentUser ? " navbar__link--disabled" : ""
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
                `navbar__link${isActive ? " navbar__link--active" : ""}${
                  !currentUser ? " navbar__link--disabled" : ""
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

// NavBar.jsx
// import { useNavigate, useLocation } from "react-router-dom";

// const NavBar = ({
//   isLoggedIn,
//   currentUser,
//   onLoginClick,
//   onRegisterClick,
//   onSignOut,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleRestrictedClick = (action, path) => {
//     if (!isLoggedIn) {
//       // Mostrar modal de login en lugar de ejecutar la acción
//       onLoginClick();
//       return;
//     }
//     // Ejecutar la acción real
//     if (path) {
//       navigate(path);
//     } else if (action) {
//       action();
//     }
//   };

//   return (
//     <nav className="navbar">
//       {/* Enlace siempre visible - Inicio */}
//       <button
//         className={`navbar__link ${
//           location.pathname === "/" ? "navbar__link_active" : ""
//         }`}
//         onClick={() => navigate("/")}
//       >
//         Inicio
//       </button>

//       {/* Enlaces que se ven pero pueden estar deshabilitados */}
//       <button
//         className={`navbar__link ${
//           !isLoggedIn ? "navbar__link_disabled" : ""
//         } ${location.pathname === "/saved-news" ? "navbar__link_active" : ""}`}
//         onClick={() => handleRestrictedClick(null, "/saved-news")}
//         title={
//           !isLoggedIn ? "Inicia sesión para ver tus artículos guardados" : ""
//         }
//       >
//         Artículos guardados
//         {!isLoggedIn && <span className="navbar__lock">🔒</span>}
//       </button>

//       {/* Sección de autenticación */}
//       <div className="navbar__auth">
//         {isLoggedIn ? (
//           <>
//             <span className="navbar__user">{currentUser.name}</span>
//             <button
//               className="navbar__button navbar__button_logout"
//               onClick={onSignOut}
//             >
//               Cerrar sesión
//             </button>
//           </>
//         ) : (
//           <>
//             <button className="navbar__button" onClick={onLoginClick}>
//               Iniciar sesión
//             </button>
//             <button
//               className="navbar__button navbar__button_secondary"
//               onClick={onRegisterClick}
//             >
//               Registrarse
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
