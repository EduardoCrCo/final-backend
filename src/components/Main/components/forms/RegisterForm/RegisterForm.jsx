import { useState } from "react";
import { validateForm } from "../../../../../utils/validateForm";
import { LoginForm } from "../LoginForm/LoginForm";
import { register } from "../../../../../utils/auth";

export const RegisterForm = ({ setPopupType, showInfoTooltip }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = validateForm(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // continuar con el registro
      register({ name: form.name, email: form.email, password: form.password })
        .then(() => {
          showInfoTooltip("¡Registro exitoso!|n|Ahora puedes iniciar sesión.");
          setTimeout(() => {
            setPopupType(signinPopupType);
          }, 1200);
        })
        .catch((err) => {
          console.error("Error al registrar:", err);
        });
    }
  };
  const signinPopupType = {
    children: (
      <LoginForm
        setPopupType={setPopupType}
        showInfoTooltip={showInfoTooltip}
      />
    ),
    className: "form-popup",
  };

  const handleSigninClick = (e) => {
    e.preventDefault();
    setPopupType({
      children: (
        <LoginForm
          setPopupType={setPopupType}
          showInfoTooltip={showInfoTooltip}
        />
      ),
      className: "form-popup",
    });
  };

  return (
    <>
      <form
        // ref={formRef}
        className="form register__form"
        noValidate
        onSubmit={handleRegister}
      >
        <span className="register__form-subtitle">Not registered yet?</span>
        <h2 className="register__form-title">Sign up</h2>
        <fieldset className="register__form-fieldset">
          <input
            id="name"
            name="name"
            type="text"
            className={`form__input ${
              errors.name ? "form__input_type_error" : ""
            } register__form-input`}
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            minLength="2"
            maxLength="30"
            required
          />
          {errors.name && (
            <span className="form__input-error_active">{errors.name}</span>
          )}
          {/* <span className="name-error" id="input-error-id"></span> */}
          <input
            id="email"
            name="email"
            type="email"
            className={`form__input ${
              errors.email ? "form__input_type_error" : ""
            } register__form-input`}
            placeholder="e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="form__input-error_active">{errors.email}</span>
          )}
          <input
            id="password"
            name="password"
            type="password"
            className={`form__input ${
              errors.password ? "form__input_type_error" : ""
            } register__form-input`}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <span className="form__input-error_active">{errors.password}</span>
          )}
          {/* <span className="password-error" id="password-error"></span> */}
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`form__input ${
              errors.confirmPassword ? "form__input_type_error" : ""
            } register__form-input`}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <span className="form__input-error_active">
              {errors.confirmPassword}
            </span>
          )}

          {/* <span
            className="confirm-password-error"
            id="confirm-password-error"
          ></span> */}
        </fieldset>

        <div className="register__footer">
          <button type="submit" className="register__form-submit_button">
            Sign up
          </button>
          <p className="register__form-footer">
            have an account?{" "}
            <a
              href="#"
              className="register__form-footer-link"
              onClick={handleSigninClick}
            >
              Sign in
            </a>
          </p>
        </div>
      </form>
      {/* InfoToolTip ahora se muestra desde App.jsx */}
    </>
  );
};
