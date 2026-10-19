import { useState } from "react";
import { loginUser, registerUser } from "../api";

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Name is required");
      return;
    }

    if (isRegister && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        const result = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        if (result.token) {
          localStorage.setItem("token", result.token);
          if (result.user) {
            localStorage.setItem("user", JSON.stringify(result.user));
          }
          onLogin(result.user);
        } else {
          setMessage("Registration successful! You can now log in.");
          setIsRegister(false);
          setName("");
          setPassword("");
        }
      } else {
        const result = await loginUser({
          email: email.trim(),
          password,
        });

        localStorage.setItem("token", result.token);
        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
        }
        onLogin(result.user);
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1>Task Manager</h1>
          <p className="auth-subtitle">
            {isRegister
              ? "Create an account with JWT authentication"
              : "Sign in with your email & password"}
          </p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="alert alert-success" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder={isRegister ? "At least 6 characters" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-wrap">
                <span className="spinner"></span>
                Processing...
              </span>
            ) : isRegister ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setMessage("");
            }}
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "Don't have an account? Register now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
