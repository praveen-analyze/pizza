// ── ProtectedRoute.jsx ──────────────────────────────────────────────────────
import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
 
export function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate short load time if necessary, or just rely on user state being populated synchronously from local storage.
    setLoading(false);
  }, [user]);
 
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FEFAF4" }}
      >
        <div className="spinner" role="status" aria-label="Loading" />
      </div>
    );
  }
 
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
 
  return children;
}