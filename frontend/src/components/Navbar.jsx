import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { auth } from "../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { cart, clearCart } = useContext(CartContext);

  const ADMIN_UID = "QCxXXNqFdMVfn4WmHK8CcWKx6K72";
  const isAdmin = user?.uid === ADMIN_UID;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setLog(!!u);
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function logout() {
    try {
      await signOut(auth);
      clearCart();
      localStorage.removeItem("cart");
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/track", label: "Track Order" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FEFAF4] shadow-[0_4px_24px_rgba(0,0,0,0.08)] border-b border-[#E8D5B0]"
          : "bg-[#FEFAF4]/90 backdrop-blur-md border-b border-[#E8D5B0]/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-3xl transition-transform duration-300 group-hover:rotate-12">🍕</span>
            <div className="flex flex-col leading-none">
              <span className="text-[11px] font-semibold tracking-[0.18em] text-[#C0392B]/70 uppercase">
                Artisan
              </span>
              <span
                className="text-[18px] font-black tracking-tight"
                style={{ color: "#1A1208", fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
              >
                Dominoze Bizza
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-5 py-2 rounded-full text-[13.5px] font-semibold tracking-wide transition-all duration-200 ${
                  location.pathname === link.to
                    ? "text-[#C0392B] bg-[#C0392B]/8"
                    : "text-[#3D2B1F]/70 hover:text-[#C0392B] hover:bg-[#C0392B]/5"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C0392B]" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`relative px-5 py-2 rounded-full text-[13.5px] font-semibold tracking-wide transition-all duration-200 ${
                  location.pathname.startsWith("/admin")
                    ? "text-[#C0392B] bg-[#C0392B]/8"
                    : "text-[#3D2B1F]/70 hover:text-[#C0392B] hover:bg-[#C0392B]/5"
                }`}
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-[#3D2B1F]/60 hover:text-[#C0392B] hover:bg-[#C0392B]/8 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C0392B] text-white text-[10px] font-black rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                  {cart.length}
                </span>
              )}
            </Link>

            {log ? (
              <button
                onClick={logout}
                className="px-5 py-2 rounded-full bg-[#1A1208]/5 text-[#1A1208]/70 font-semibold text-[13px] hover:bg-[#1A1208]/10 transition-all duration-200 border border-[#1A1208]/10"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-full bg-[#C0392B] text-white font-bold text-[13px] hover:bg-[#A93226] transition-all duration-200 shadow-[0_2px_12px_rgba(192,57,43,0.35)] hover:shadow-[0_4px_16px_rgba(192,57,43,0.45)]"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 rounded-full text-[#3D2B1F]/60 hover:bg-[#1A1208]/8 transition-all"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-[#E8D5B0] bg-[#FEFAF4] shadow-lg">
          <div className="px-5 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  location.pathname === link.to
                    ? "text-[#C0392B] bg-[#C0392B]/8"
                    : "text-[#3D2B1F]/70 hover:text-[#C0392B] hover:bg-[#C0392B]/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  location.pathname.startsWith("/admin")
                    ? "text-[#C0392B] bg-[#C0392B]/8"
                    : "text-[#3D2B1F]/70 hover:text-[#C0392B] hover:bg-[#C0392B]/5"
                }`}
              >
                Admin Panel
              </Link>
            )}
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[#3D2B1F]/70 hover:text-[#C0392B] hover:bg-[#C0392B]/5 font-semibold text-sm transition-all"
            >
              🛒 Cart
              {cart.length > 0 && (
                <span className="bg-[#C0392B] text-white text-[10px] font-black rounded-full w-[18px] h-[18px] flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            <div className="pt-2 pb-1">
              {log ? (
                <button
                  onClick={logout}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1208]/5 text-[#1A1208]/70 font-semibold text-sm hover:bg-[#1A1208]/10 transition-all text-left border border-[#1A1208]/10"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { navigate("/login"); setOpen(false); }}
                  className="w-full px-4 py-3 rounded-xl bg-[#C0392B] text-white font-bold text-sm hover:bg-[#A93226] transition-all text-center shadow-[0_2px_12px_rgba(192,57,43,0.3)]"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};