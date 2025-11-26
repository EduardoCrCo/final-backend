import Logo from "../../images/droneAction2.png";
import Avatar from "../../images/avatar.png";
import EditAvatarIcon from "../../images/editAvatar.svg";
import { NavBar } from "../NavBar/NavBar";
import { useContext, useState } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";
import { RegisterForm } from "../Main/components/forms/RegisterForm/RegisterForm";
import { EditProfile } from "../Main/components/forms/EditProfile/EditProfile";
import { EditAvatar } from "../Main/components/forms/EditAvatar/EditAvatar";

export const Header = ({
  setPopupType,
  showInfoTooltip,
  handleRegistration,
  onLogout,
  handlePopupClose,
  onUpdateUser,
}) => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
    children: (
      <EditProfile onClose={handlePopupClose} onUpdateUser={onUpdateUser} />
    ),
    className: "form-popup",
  };

  const editAvatarPopupType = {
    children: <EditAvatar onClose={handlePopupClose} />,
    className: "form-popup",
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo-name-container">
          <img className="header__logo" src={Logo} alt="Drone logo" />
          <h1 className="header__title">De Drones</h1>
        </div>

        {/* Botón hamburguesa para móvil */}
        <button
          className="header__hamburger-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`header__hamburger-line ${
              isMobileMenuOpen ? "header__hamburger-line--rotated-1" : ""
            }`}
          ></span>
          <span
            className={`header__hamburger-line ${
              isMobileMenuOpen ? "header__hamburger-line--hidden" : ""
            }`}
          ></span>
          <span
            className={`header__hamburger-line ${
              isMobileMenuOpen ? "header__hamburger-line--rotated-2" : ""
            }`}
          ></span>
        </button>

        <div className="header__spacer">
          <NavBar
            isMobileMenuOpen={isMobileMenuOpen}
            onCloseMobileMenu={closeMobileMenu}
          />
          <div className="header__account">
            {(!currentUser || Object.keys(currentUser).length === 0) && (
              <button
                className="header__signup-button"
                type="button"
                onClick={handleSignupClick}
              >
                Sign up / Sign in
              </button>
            )}

            <div className="header-profile__avatar">
              {currentUser && Object.keys(currentUser).length > 0 && (
                <div className="header__user-hover-area">
                  <button
                    className="header__user-name-button"
                    onClick={() => setPopupType(userNamePopupType)}
                  >
                    <span className="header__user-name">
                      {currentUser?.name}
                    </span>
                  </button>
                  <button
                    className="header__logout-btn"
                    onClick={onLogout}
                    tabIndex={0}
                  >
                    Logout
                  </button>
                </div>
              )}

              <div className="header-profile__avatar-image-container">
                <img
                  src={currentUser?.avatar || Avatar}
                  alt="imagen del perfil"
                  className="header-profile__avatar-image"
                />

                <button
                  className={`header__profile-avatar__edit_button ${
                    currentUser ? "enabled" : "disabled"
                  }`}
                  onClick={() =>
                    currentUser && setPopupType(editAvatarPopupType)
                  }
                  disabled={!currentUser}
                >
                  <img
                    className="header__profile-avatar__edit_button-icon"
                    src={EditAvatarIcon}
                    alt="icono de editar imagen de perfil"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
