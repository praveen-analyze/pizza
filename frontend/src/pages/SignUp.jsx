import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AuthShell, Spinner } from '../components/AuthShell';
import { AlertIcon } from '../components/Icons';


function SignUp() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const { user, login } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const res = await axios.post(`${apiURL}/api/users/register`, { name, email, password, phone, address });
      login(res.data, res.data.token);
      navigate("/");
    } catch (err) {
      console.log("failed to add user", err);
      setError(err.response?.data?.message || err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", type: "text", value: name, onChange: setName, placeholder: "John Doe", autoComplete: "name" },
    { label: "Phone Number", type: "tel", value: phone, onChange: setPhone, placeholder: "9876543210", autoComplete: "tel" },
    { label: "Address", type: "text", value: address, onChange: setAddress, placeholder: "123 Main St, Apt 4", autoComplete: "street-address" },
    { label: "Email Address", type: "email", value: email, onChange: setEmail, placeholder: "you@example.com", autoComplete: "email" },
  ];

  return (
    <AuthShell title="Create Account" subtitle="Join Dominoze Bizza today" image="/pizza4.jpg">
      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-x-4">
          {fields.map((field) => {
            const id = "su-" + field.label.toLowerCase().replace(/\s+/g, "-");
            return (
              <div key={field.label} className={`mb-5 ${field.label === "Address" || field.label === "Email Address" ? "sm:col-span-2" : ""}`}>
                <label htmlFor={id} className="t-label block mb-2">{field.label}</label>
                <input
                  id={id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  required
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  className="field"
                />
              </div>
            );
          })}
        </div>

        {/* Password */}
        <div className="mb-5">
          <label htmlFor="su-password" className="t-label block mb-2">Password</label>
          <div className="relative">
            <input
              id="su-password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              className="field pr-20"
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

        {/* Confirm Password */}
        <div className="mb-5">
          <label htmlFor="su-confirm" className="t-label block mb-2">Confirm Password</label>
          <input
            id="su-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className="field"
            aria-invalid={error === "Passwords do not match" ? true : undefined}
          />
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="alert-error mb-5">
            <AlertIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn btn-primary btn-block mt-2">
          {loading ? <Spinner label="Creating Account..." /> : "Create Account"}
        </button>

        {/* Login link */}
        <p className="text-[0.9375rem] text-[var(--color-muted)] mt-6 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-bold text-[var(--color-tomato)] underline-offset-4 hover:underline min-h-[44px]"
          >
            Sign in here →
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

export default SignUp;
