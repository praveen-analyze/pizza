import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";

function LogIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#FEFAF4" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #E85D3A22 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #C0392B18 0%, transparent 50%)`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🍕</div>
          <h1
            className="text-3xl font-black mb-2"
            style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            Welcome back!
          </h1>
          <p className="text-[#A89585] font-light">Sign in to your Dominoze Bizza account</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EDE0CC",
            boxShadow: "0 8px 40px rgba(26,18,8,0.1)",
          }}
        >
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-5">
              <label
                className="block text-xs font-bold mb-2 tracking-wide uppercase"
                style={{ color: "#7A6354" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  color: "#1A1208",
                  border: "1.5px solid #E8D5B0",
                  backgroundColor: "#FEFAF4",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "#C0392B";
                  e.target.style.boxShadow = "0 0 0 3px rgba(192,57,43,0.1)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "#E8D5B0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label
                className="block text-xs font-bold mb-2 tracking-wide uppercase"
                style={{ color: "#7A6354" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all pr-16"
                  style={{
                    color: "#1A1208",
                    border: "1.5px solid #E8D5B0",
                    backgroundColor: "#FEFAF4",
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = "#C0392B";
                    e.target.style.boxShadow = "0 0 0 3px rgba(192,57,43,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = "#E8D5B0";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold tracking-wider uppercase transition-colors"
                  style={{ color: "#A89585" }}
                  onMouseEnter={e => e.target.style.color = "#C0392B"}
                  onMouseLeave={e => e.target.style.color = "#A89585"}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-5 p-3.5 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "#FFF5F3", border: "1px solid #F5C0B8", color: "#C0392B" }}
              >
                {error}
              </div>
            )}

            {/* Register link */}
            <p className="text-xs text-[#A89585] mb-6">
              New here?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-bold transition-colors"
                style={{ color: "#C0392B" }}
              >
                Create an account →
              </button>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-white font-bold rounded-xl text-[14px] tracking-wide transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: "linear-gradient(135deg, #C0392B, #E85D3A)",
                boxShadow: "0 6px 20px rgba(192,57,43,0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing In...
                </span>
              ) : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;