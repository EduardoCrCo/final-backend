import { useState } from "react";
import { RegisterForm } from "../RegisterForm/RegisterForm";

export const LoginForm = ({ onLogin, setPopupType, showInfoTooltip }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const signupPopupType = {
    children: (
      <RegisterForm
        setPopupType={setPopupType}
        showInfoTooltip={showInfoTooltip}
        onLogin={onLogin}
      />
    ),
    className: "form-popup",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevenir múltiples submissions
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onLogin(form.email, form.password, {
        setPopupType,
        showInfoTooltip,
      });
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    setPopupType(signupPopupType);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="form login__form"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
    >
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
        <button
          type="submit"
          className="login__form-submit_button"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.6 : 1,
            // cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {/* {isLoading ? "Signing in..." : "Sign in"} */}
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
