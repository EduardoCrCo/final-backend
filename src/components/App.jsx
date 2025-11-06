import { useState, useEffect } from "react";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { Main } from "./Main/Main";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./Dashboard/Dashboard";
import { Reviews } from "./Reviews/Reviews";
import { AboutMe } from "./AboutMe/AboutMe";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { Popup } from "../components/Main/components/Popup/Popup";
import { InfoTooltip } from "../components/Main/components/forms/InfoTooltip/InfoTooltip";
import { LoginForm } from "./Main/components/forms/LoginForm/LoginForm";
import * as auth from "../utils/auth";
import api from "../utils/api";

export const App = () => {
  const [popupType, setPopupType] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [currentUser, setCurrentUser] = useState({});

  // const handleRegistration = (userData) => {
  //   // Lógica para manejar el registro
  //   setCurrentUser(userData);
  //   localStorage.setItem("currentUser", JSON.stringify(userData));
  // };

  useEffect(() => {
    // Try to get user info from API (if token is valid)
    api
      .getUserInfo()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => {
        // fallback to localStorage if API fails
        const user = localStorage.getItem("currentUser");
        if (user) {
          setCurrentUser(JSON.parse(user));
        } else {
          setCurrentUser(null);
        }
      });
  }, []);
  // const handleUpdateUser = async (userData) => {
  //   try {
  //     // The updateUser function eventually calls the problematic fetch logic in api.js
  //     const updatedUser = await api.updateUser(userData.name);
  //     // Handle successful update (e.g., update state, show success message)
  //     console.log("User updated successfully:", updatedUser);
  //   } catch (error) {
  //     // This catch block will now handle the "Validation failed" error
  //     // thrown from api.js, as well as any other errors in the promise chain.
  //     console.error("Failed to update user:", error.message);
  //     // You can display this error to the user, e.g., using a state variable
  //     // setError(error.message);
  //   }
  // };

  const handleRegistration = (name, email, password) => {
    auth
      .register({ name, email, password })
      .then(() => {
        setCurrentUser({ name, email });
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ name, email, password })
        );
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Centralized login handler for LoginForm
  const handleLogin = async (
    email,
    password,
    { setPopupType, showInfoTooltip }
  ) => {
    try {
      const data = await auth.authorize({ email, password });
      if (data && data.token) {
        localStorage.setItem("jwt", data.token);
        // Optionally, fetch user info after login
        const user = await api.getUserInfo();
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        if (typeof setPopupType === "function") setPopupType(null);
        if (typeof showInfoTooltip === "function")
          showInfoTooltip("¡Inicio de sesión exitoso!");
      } else {
        if (typeof showInfoTooltip === "function")
          showInfoTooltip("Error: Token no recibido");
      }
    } catch (err) {
      if (typeof showInfoTooltip === "function")
        showInfoTooltip("Error al iniciar sesión");
      console.error("Login error:", err);
    }
  };

  const handlePopupClose = (evt) => {
    if (evt && typeof evt.preventDefault === "function") {
      evt.preventDefault();
    }
    setPopupType(null);
  };

  const handleShowInfoTooltip = (message) => {
    setTooltipMessage(message);
    setShowTooltip(true);
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div className="page">
        <Header
          showInfoTooltip={handleShowInfoTooltip}
          popupType={popupType}
          setPopupType={setPopupType}
          handlePopupClose={handlePopupClose}
          handleRegistration={handleRegistration}
          //handleLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/aboutMe" element={<AboutMe />} />
        </Routes>
        <Footer />
        {popupType && (
          <Popup
            onClose={handlePopupClose}
            customClassName={popupType.className}
          >
            {/* If the popup is LoginForm, inject onLogin handler */}
            {popupType.children && popupType.children.type === LoginForm ? (
              <LoginForm {...popupType.children.props} onLogin={handleLogin} />
            ) : (
              popupType.children
            )}
          </Popup>
        )}
        {showTooltip && (
          <InfoTooltip
            message={tooltipMessage}
            onClose={() => setShowTooltip(false)}
          />
        )}
      </div>
    </CurrentUserContext.Provider>
  );
};
