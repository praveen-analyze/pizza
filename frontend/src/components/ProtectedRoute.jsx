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
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl animate-bounce">🍕</div>
          <div className="w-10 h-10 border-4 border-[#E8D5B0] border-t-[#C0392B] rounded-full animate-spin" />
        </div>
      </div>
    );
  }
 
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
 
  return children;
}