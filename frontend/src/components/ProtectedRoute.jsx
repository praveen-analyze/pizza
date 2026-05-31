// ── ProtectedRoute.jsx ──────────────────────────────────────────────────────
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
 
const ADMIN_UID = "QCxXXNqFdMVfn4WmHK8CcWKx6K72";
 
export function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);
 
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
 
  if (!user || user.uid !== ADMIN_UID) {
    return <Navigate to="/" replace />;
  }
 
  return children;
}