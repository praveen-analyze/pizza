import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { AuthShell, Spinner } from "../components/AuthShell";
import { AlertIcon } from "../components/Icons";

function LogIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.post(`${apiURL}/api/users/login`, { email, password });
      login(res.data, res.data.token);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || error.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back!" subtitle="Sign in to your Dominoze Bizza account">
      <form onSubmit={handleLogin} noValidate={false}>
        {/* Email */}
        <div className="mb-5">
          <label htmlFor="login-email" className="t-label block mb-2">Email Address</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="field"
            aria-invalid={error ? true : undefined}
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label htmlFor="login-password" className="t-label block mb-2">Password</label>
          <div className="relative">
            <input
              id="login-password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="field pr-20"
              aria-invalid={error ? true : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              aria-pressed={showPass}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[44px] px-3 rounded-lg text-[0.8125rem] font-bold text-[var(--color-muted)] hover:text-[var(--color-tomato)] transition-colors"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="alert-error mb-5">
            <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary btn-block mt-2">
          {loading ? <Spinner label="Signing In..." /> : "Sign In"}
        </button>

        {/* Register link */}
        <p className="text-[0.9375rem] text-[var(--color-muted)] mt-6 text-center">
          New here?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-bold text-[var(--color-tomato)] underline-offset-4 hover:underline min-h-[44px]"
          >
            Create an account →
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

export default LogIn;
