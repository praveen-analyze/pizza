import { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { gsap, ScrollTrigger, useGSAP, MQ } from "../motion";
import { CartIcon, MenuIcon, CloseIcon } from "./Icons";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart, clearCart } = useContext(CartContext);
  const { user, logout: contextLogout } = useContext(AuthContext);
  const headerRef = useRef(null);
  const progressRef = useRef(null);
  const badgeRefs = useRef([]);

  const isAdmin = user?.isAdmin;
  const log = !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Header hide on scroll down / show on scroll up + progress bar (visual only).
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const show = gsap.quickTo(headerRef.current, "yPercent", { duration: 0.35, ease: "power3.out" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (progressRef.current) gsap.set(progressRef.current, { scaleX: self.progress });
          const hide = self.direction === 1 && self.scroll() > 160 && !headerRef.current?.contains(document.activeElement);
          show(hide ? -100 : 0);
        },
      });
    });
    return () => mm.revert();
  });

  // Cart badge bounce on add-to-cart (event from motion.flyToCart).
  useEffect(() => {
    const bump = () => {
      if (window.matchMedia(MQ.reduce).matches) return;
      badgeRefs.current.filter(Boolean).forEach((el) =>
        gsap.fromTo(el, { scale: 1.6 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" })
      );
    };
    window.addEventListener("cart:bump", bump);
    return () => window.removeEventListener("cart:bump", bump);
  }, []);

  async function logout() {
    try {
      contextLogout();
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
  const allLinks = isAdmin ? [...navLinks, { to: "/admin", label: "Admin Panel", prefix: true }] : navLinks;
  const isActive = (l) => (l.prefix ? location.pathname.startsWith(l.to) : location.pathname === l.to);

  const badge = (i) =>
    cart.length > 0 ? (
      <span
        ref={(el) => (badgeRefs.current[i] = el)}
        className="absolute -top-0.5 -right-0.5 num bg-[var(--color-tomato)] text-white text-[11px] font-extrabold rounded-full min-w-[20px] h-5 px-1 grid place-items-center ring-2 ring-[var(--color-dough)]"
      >
        {cart.length}
      </span>
    ) : null;

  return (
    <>
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
      <nav
        ref={headerRef}
        data-scrolled={scrolled || open}
        className="site-header sticky top-0 z-50 bg-[var(--color-dough)]"
      >
        <div className="container-x">
          <div className={`flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-[60px]" : "h-[var(--header-h)]"}`}>
            {/* Logo (unchanged mark + wordmark) */}
            <Link to="/" className="flex items-center gap-2.5 group rounded-lg" aria-label="Dominoze Bizza home">
              <span className="text-[28px] leading-none transition-transform duration-300 group-hover:rotate-12" aria-hidden="true">🍕</span>
              <span className="flex flex-col leading-none">
                <span className="text-[10.5px] font-bold tracking-[0.2em] text-[var(--color-tomato)] uppercase">Artisan</span>
                <span className="font-display text-[19px] font-extrabold tracking-[-0.02em] text-[var(--color-ink)]">Dominoze Bizza</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {allLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActive(link) ? "page" : undefined}
                  className={`relative px-4 py-2.5 rounded-full text-[15px] font-semibold transition-colors duration-200 ${
                    isActive(link) ? "text-[var(--color-tomato)]" : "text-[var(--color-ink-2)] hover:text-[var(--color-tomato)]"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-4 right-4 bottom-1 h-[2px] rounded-full bg-[var(--color-tomato)] origin-left transition-transform duration-300 ${
                      isActive(link) ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/cart" className="icon-btn relative" aria-label={`Cart, ${cart.length} items`} data-cart-target>
                <CartIcon className="w-[23px] h-[23px]" />
                {badge(0)}
              </Link>

              {log ? (
                <button onClick={logout} className="btn btn-ghost btn-sm">
                  Logout
                </button>
              ) : (
                <button onClick={() => navigate("/login")} className="btn btn-primary btn-sm">
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile: cart + toggle */}
            <div className="flex md:hidden items-center gap-1">
              <Link to="/cart" className="icon-btn relative" aria-label={`Cart, ${cart.length} items`} data-cart-target>
                <CartIcon className="w-[23px] h-[23px]" />
                {badge(1)}
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className="md:hidden icon-btn"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div id="mobile-menu" className="md:hidden border-t border-[var(--color-sand-soft)] bg-[var(--color-dough)]">
            <div className="container-x py-4 flex flex-col gap-1">
              {allLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link) ? "page" : undefined}
                  className={`flex items-center min-h-[52px] px-4 rounded-xl font-display text-[22px] font-bold tracking-[-0.02em] transition-colors ${
                    isActive(link) ? "text-[var(--color-tomato)] bg-[rgb(192_57_43/0.07)]" : "text-[var(--color-ink)] hover:bg-[var(--color-crust)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 min-h-[52px] px-4 rounded-xl font-display text-[22px] font-bold tracking-[-0.02em] text-[var(--color-ink)] hover:bg-[var(--color-crust)]"
              >
                Cart
                {cart.length > 0 && (
                  <span className="num bg-[var(--color-tomato)] text-white text-xs font-extrabold rounded-full min-w-[22px] h-[22px] px-1 grid place-items-center">
                    {cart.length}
                  </span>
                )}
              </Link>
              <div className="pt-3 pb-1">
                {log ? (
                  <button onClick={logout} className="btn btn-ghost btn-block">
                    Logout
                  </button>
                ) : (
                  <button onClick={() => { navigate("/login"); setOpen(false); }} className="btn btn-primary btn-block">
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
