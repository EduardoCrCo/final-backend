
import { useState } from "react";
import { RegisterForm } from "../RegisterForm/RegisterForm";

export const LoginForm = ({ onLogin, setPopupType, showInfoTooltip }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const signupPopupType = {
    children: (
      <RegisterForm
        setPopupType={setPopupType}
        showInfoTooltip={showInfoTooltip}
      />
    ),
    className: "form-popup",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(form.email, form.password, { setPopupType, showInfoTooltip });
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    setPopupType(signupPopupType);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form className="form login__form" onSubmit={handleSubmit}>
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
