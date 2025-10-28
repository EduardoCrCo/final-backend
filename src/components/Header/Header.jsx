import Logo from "../../images/mavic-air-2.PNG";
import Avatar from "../../images/avatar.png";
import EditAvatar from "../../images/editAvatar.svg";
import { NavBar } from "../NavBar/NavBar";
import { useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { RegisterForm } from "../../components/Main/components/forms/RegisterForm/RegisterForm";
import { EditProfile } from "../Main/components/forms/EditProfile/EditProfile";

export const Header = ({
  setPopupType,
  showInfoTooltip,
  handleRegistration,
  handleLogout,
  handlePopupClose,
}) => {
  const { currentUser } = useContext(CurrentUserContext);

  const signupPopupType = {
    children: (
      <RegisterForm
        setPopupType={setPopupType}
        showInfoTooltip={showInfoTooltip}
        onRegister={handleRegistration}
      />
    ),
    className: "form-popup",
  };

  const handleSignupClick = () => {
    setPopupType(signupPopupType);
  };

  const userNamePopupType = {
    children: <EditProfile onClose={handlePopupClose} />,
    className: "form-popup",
  };
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-name-container">
          <img className="header__logo" src={Logo} alt="Drone logo" />
          <h1 className="header__title">DroneVision</h1>
        </div>

        <div className="header__spacer">
          <NavBar />
          <div className="header__account">
            {!currentUser && (
              <button
                className="header__signup-button"
                type="button"
                onClick={handleSignupClick}
              >
                Sign up / Sign in
              </button>
            )}
            <div className="header-profile__avatar">
              <img
                src={Avatar}
                alt="imagen del perfil"
                className="header-profile__avatar-image"
              />
              <img
                src={EditAvatar}
                alt="icono de editar imagen de perfil"
                className="header__profile-avatar__edit_icon"
              />
              {currentUser && (
                <div className="header__user-hover-area">
                  <button
                    className="header__user-name-button"
                    onClick={() => setPopupType(userNamePopupType)}
                  >
                    <span className="header__user-name">
                      {currentUser.name}
                    </span>
                  </button>
                  <button
                    className="header__logout-btn"
                    onClick={handleLogout}
                    tabIndex={0}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Header.jsx
// import { useState } from "react";
// import NavBar from "../NavBar/NavBar";
// import LoginModal from "./LoginModal";
// import RegisterModal from "./RegisterModal";

// export const Header = ({ currentUser, onSignOut }) => {
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

//   return (
//     <header className="header">
//       <div className="header__logo">
//         <h1>NewsExplorer</h1>
//       </div>

//       <NavBar
//         isLoggedIn={!!currentUser}
//         currentUser={currentUser}
//         onLoginClick={() => setIsLoginModalOpen(true)}
//         onRegisterClick={() => setIsRegisterModalOpen(true)}
//         onSignOut={onSignOut}
//       />

//       {isLoginModalOpen && (
//         <LoginModal
//           onClose={() => setIsLoginModalOpen(false)}
//           onRegisterClick={() => {
//             setIsLoginModalOpen(false);
//             setIsRegisterModalOpen(true);
//           }}
//         />
//       )}

//       {isRegisterModalOpen && (
//         <RegisterModal
//           onClose={() => setIsRegisterModalOpen(false)}
//           onLoginClick={() => {
//             setIsRegisterModalOpen(false);
//             setIsLoginModalOpen(true);
//           }}
//         />
//       )}
//     </header>
//   );
// };
