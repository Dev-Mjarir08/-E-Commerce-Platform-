import { useState } from "react";
import "./Login.css";

import email_icon from "../../components/Assets/email.png";
import padlock_icon from "../../components/Assets/padlock.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="Store introduction">
        <div className="showcase-topline">
          <span className="brand-mark">M</span>
          <span>E Commerce Market</span>
        </div>
        <div className="showcase-copy">
          <p className="eyebrow">A considered collection</p>
          <h1>
            Things worth
            <br />
            <em>coming home to.</em>
          </h1>
          <p className="showcase-description">
            Thoughtful objects, everyday essentials, and small luxuries selected
            for modern living.
          </p>
        </div>
        <div className="showcase-note">
          <span className="note-line" />
          <span>New season, now arriving</span>
        </div>
      </section>

      <section className="login-panel">
        <div className="mobile-brand">
          <span className="brand-mark">M</span> Maison Market
        </div>
        <div className="login-card">
          <div className="login-heading">
            <p className="eyebrow">Welcome back</p>
            <h2>Sign in to your account</h2>
            <p>Pick up where you left off.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="email">
              Email address
            </label>
            <div className="input-wrap">
              <img src={email_icon} alt="" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="password-label-row">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <button className="forgot-link" type="button">
                Forgot password?
              </button>
            </div>
            <div className="input-wrap">
              <img src={padlock_icon} alt="" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                minLength="6"
                required
              />
              <button
                className="visibility-button"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label className="remember-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span className="checkmark" />
              <span>Keep me signed in</span>
            </label>

            <button className="submit-button" type="submit">
              Sign in <span aria-hidden="true">-&gt;</span>
            </button>
            {submitted && (
              <p className="form-message" role="status">
                Thanks. Your sign-in details are ready to submit.
              </p>
            )}
          </form>

          <p className="signup-prompt">
            New to E Commerce Market?{" "}
            <button type="button">Create an account</button>
          </p>
        </div>
        <p className="legal-copy">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </section>
    </main>
  );
};

export default Login;
