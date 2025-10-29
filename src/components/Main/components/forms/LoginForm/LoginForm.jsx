import { useState, useContext } from "react";
//import { validateForm } from "../../../../../utils/validateForm";
import { CurrentUserContext } from "../../../../../context/CurrentUserContext";
import { authorize } from "../../../../../utils/auth";
import api from "../../../../../utils/api";

import { RegisterForm } from "../RegisterForm/RegisterForm";

export const LoginForm = ({ setPopupType, showInfoTooltip }) => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const signupPopupType = {
    children: (
      <RegisterForm
        setPopupType={setPopupType}
        showInfoTooltip={showInfoTooltip}
      />
    ),
    className: "form-popup",
  };

  const handleLogin = (e) => {
    e.preventDefault();

    authorize({ email: form.email, password: form.password })
      .then((data) => {
        console.log("Respuesta authorize:", data);
        console.log("Token:", data.token);
        localStorage.setItem("jwt", data.token);
        console.log(
          "Token almacenado en localStorage:",
          localStorage.getItem("jwt")
        );
        return api.getUserInfo();
      })
      .then((userData) => {
        console.log("User info:", userData);
        // resto...
        console.log(userData);
        setCurrentUser(userData);
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            username: userData.name,
            email: userData.email,
            password: form.password,
          })
        );
        // setCurrentUser(userData); // Guarda el usuario en contexto
        showInfoTooltip && showInfoTooltip("¡Login exitoso!|n|Bienvenido.");
        setPopupType(null); // Cierra el popup
      })
      .catch((err) => {
        console.error("Error general:", err);
        showInfoTooltip &&
          showInfoTooltip("No se pudo obtener usuario|n|Intenta de nuevo.");
      });

    // authorize({ email: form.email, password: form.password })
    //   .then((data) => {
    //     // Guarda el token recibido
    //     localStorage.setItem("jwt", data.token);
    //     // Obtiene los datos completos del usuario
    //     console.log(data);
    //     api
    //       .getUserInfo()
    //       .then((userData) => {
    //         console.log(userData);
    //         setCurrentUser({ name: userData.name, email: userData.email });
    //         localStorage.setItem(
    //           "currentUser",
    //           JSON.stringify({
    //             username: userData.name,
    //             email: userData.email,
    //             password: form.password,
    //           })
    //         );
    //         // setCurrentUser(userData); // Guarda el usuario en contexto
    //         showInfoTooltip && showInfoTooltip("¡Login exitoso!|n|Bienvenido.");
    //         setPopupType(null); // Cierra el popup
    //       })
    //       .catch(() => {
    //         showInfoTooltip &&
    //           showInfoTooltip("No se pudo obtener usuario|n|Intenta de nuevo.");
    //       });
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     showInfoTooltip &&
    //       showInfoTooltip("Credenciales incorrectas|n|Intenta de nuevo.");
    //   });
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    setPopupType(signupPopupType);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form className="form login__form" onSubmit={handleLogin}>
      <span className="login__form-subtitle">Already have an account?</span>
      <h2 className="login__form-title">Sign in</h2>
      <fieldset className="login__form-fieldset">
        <input
          id="email"
          name="email"
          type="email"
          className="form__input form__input-email"
          placeholder="e-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          className="form__input form__input-password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </fieldset>

      <div className="login__footer">
        <button type="submit" className="login__form-submit_button">
          Sign in
        </button>
        <p className="login__form-footer">
          haven't account?{" "}
          <a
            href="#"
            className="login__form-footer-link"
            onClick={handleSignupClick}
          >
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};
